import Request from "@src/application/interfaces/request";
import RequestHandler from "@src/application/interfaces/requesthandler";
import { validate, IsNotEmpty, IsString, IsEmail } from "class-validator";
import { injectable, inject } from "inversify";
import Result from "@src/domain/common/result";
import ActionResult from "@src/domain/common/actionresult";
import IUserRepository from "@src/application/users/interfaces/userRepository";
import jwt from "jsonwebtoken";
import LoginDto from "@src/application/auth/commands/loginDto";
import { v4 as uuidv4 } from "uuid";
import argon2 from "argon2";
import { Field, InputType } from "type-graphql";
import { TYPES } from "@src/application/common/types";
import EnvironmentVariable from "@src/environmentVariable";

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

		const login = await this._userrepository.login(request.email);
		if (!login) {
			return ActionResult.fail(`Invalid credentials!`);
		}

		const match = await argon2.verify(login[1], request.password);
		if (!match) {
			return ActionResult.fail(`Invalid credentials!`);
		}

		const userDetail = {
			id: login[0],
		};

		const token = jwt.sign(userDetail, EnvironmentVariable.SECRET_KEY);
		const refreshToken = uuidv4();

		const loginDto = new LoginDto();
		loginDto.token = token;
		loginDto.refreshToken = refreshToken;

		// await this._userrepository.update(userByEmail);

		return ActionResult.ok(loginDto);
	}
}
