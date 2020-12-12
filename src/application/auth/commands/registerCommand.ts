import Request from "../../interfaces/request";
import RequestHandler from "../../interfaces/requesthandler";
import { validate, IsNotEmpty, IsString, IsEmail } from "class-validator";
import User from "../../../domain/users/user";
import { injectable, inject } from "inversify";
import Result from "../../../domain/common/result";
import ActionResult from "../../../domain/common/actionresult";
import { TYPES } from "../../common/types";
import argon2 from "argon2";
import { Field, InputType } from "type-graphql";
import IUserRepository from "../../users/interfaces/userRepository";

@InputType()
export class RegisterCommand
	implements Request<Promise<Result<string | number>>> {
	@Field()
	@IsNotEmpty()
	@IsString()
	public firstName: string;

	@Field()
	@IsNotEmpty()
	@IsString()
	public lastName: string;

	@Field()
	public otherName: string;

	@Field()
	@IsEmail()
	public email: string;

	@Field()
	@IsNotEmpty()
	@IsString()
	public password: string;

	public static create(body: {
		firstName: string;
		lastName: string;
		otherName: string;
		email: string;
		password: string;
	}): RegisterCommand {
		var registerCommand = new RegisterCommand();
		registerCommand.email = body.email;
		registerCommand.firstName = body.firstName;
		registerCommand.lastName = body.lastName;
		registerCommand.otherName = body.otherName;
		registerCommand.password = body.password;

		return registerCommand;
	}
}

@injectable()
export class RegisterCommandHandler
	implements RequestHandler<RegisterCommand, Promise<Result<string | number>>> {
	private readonly _userrepository: IUserRepository;
	constructor(@inject(TYPES.IUserRepository) userRepository: IUserRepository) {
		this._userrepository = userRepository;
	}

	public async handle(
		request: RegisterCommand
	): Promise<Result<string | number>> {
		const validationResult = await validate(request);
		if (validationResult.length > 0) {
			return ActionResult.fail(validationResult.map((x) => x.constraints));
		}

		const userExistByEmail = await this._userrepository.userExistByEmail(
			request.email!
		);

		if (userExistByEmail) {
			return ActionResult.fail(
				`A user with the email: '${request.email}' already exist!`
			);
		}

		const hashedPassword = await argon2.hash(request.password!);

		const user = User.create(
			request.firstName!,
			request.lastName!,
			request.otherName!,
			request.email!,
			hashedPassword
		);

		if (user.failure) {
			return ActionResult.fail(user.error);
		}

		const result = await this._userrepository.save(user.data);
		return ActionResult.ok(result);
	}
}
