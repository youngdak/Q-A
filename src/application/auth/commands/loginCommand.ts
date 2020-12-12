import Request from "../../interfaces/request";
import RequestHandler from "../../interfaces/requesthandler";
import { validate, IsNotEmpty, IsString, IsEmail } from "class-validator";
import { injectable, inject } from "inversify";
import Result from "../../../domain/common/result";
import ActionResult from "../../../domain/common/actionresult";
import { TYPES } from "../../common/types";
import IUserRepository from "../../users/interfaces/userRepository";
import jwt from "jsonwebtoken";
import LoginDto from "./loginDto";
import { v4 as uuidv4 } from "uuid";
import argon2 from "argon2";
import UserToken from "../../../domain/users/userToken";
import { Field, InputType } from "type-graphql";
import EnvironmentVariable from "../../../environmenVariable";

@InputType()
export class LoginCommand implements Request<Promise<Result<LoginDto>>> {
	@Field()
	@IsEmail()
	public email: string;

	@Field()
	@IsNotEmpty()
	@IsString()
	public password: string;

	@Field()
	@IsNotEmpty()
	@IsString()
	public device: string;

	public static create(body: {
		email: string;
		password: string;
		device: string;
	}): LoginCommand {
		var loginCommand = new LoginCommand();
		loginCommand.email = body.email;
		loginCommand.password = body.password;
		loginCommand.device = body.device;

		return loginCommand;
	}
}

@injectable()
export class LoginCommandHandler
	implements RequestHandler<LoginCommand, Promise<Result<LoginDto>>> {
	private readonly _userrepository: IUserRepository;
	constructor(@inject(TYPES.IUserRepository) userRepository: IUserRepository) {
		this._userrepository = userRepository;
	}

	public async handle(request: LoginCommand): Promise<Result<LoginDto>> {
		const validationResult = await validate(request);
		if (validationResult.length > 0) {
			return ActionResult.fail(validationResult.map((x) => x.constraints));
		}

		const userByEmail = await this._userrepository.getByEmail(request.email);
		if (!userByEmail) {
			return ActionResult.fail(`Invalid credentials!`);
		}

		const match = await argon2.verify(userByEmail.password, request.password);
		if (!match) {
			return ActionResult.fail(`Invalid credentials!`);
		}

		const userDetail = {
			id: userByEmail.id?.Id,
		};

		const token = jwt.sign(userDetail, EnvironmentVariable.SECRET_KEY);
		const refreshToken = uuidv4();

		const hashedToken = await argon2.hash(token);
		const hashedRefreshToken = await argon2.hash(token);
		const userTokenResult = UserToken.create(
			hashedToken,
			hashedRefreshToken,
			request.device
		);

		if (userTokenResult.failure) {
			return ActionResult.fail(userTokenResult.error);
		}

		userByEmail.addOrUpdateToken(userTokenResult.data);

		const loginDto = new LoginDto();
		loginDto.token = token;
		loginDto.refreshToken = refreshToken;

		await this._userrepository.update(userByEmail);

		return ActionResult.ok(loginDto);
	}
}
