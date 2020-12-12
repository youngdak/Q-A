import Request from "../../interfaces/request";
import RequestHandler from "../../interfaces/requesthandler";
import { validate, IsNotEmpty, IsString, IsEmail } from "class-validator";
import { injectable, inject } from "inversify";
import Result from "../../../domain/common/result";
import ActionResult from "../../../domain/common/actionresult";
import { TYPES } from "../../common/types";
import IUserRepository from "../../users/interfaces/userRepository";
import argon2 from "argon2";

export class LogoutCommand implements Request<Promise<Result<void>>> {
	@IsEmail()
	public email: string;

	@IsNotEmpty()
	@IsString()
	public token: string;

	public static create(body: { email: string; token: string }): LogoutCommand {
		var logoutCommand = new LogoutCommand();
		logoutCommand.email = body.email;
		logoutCommand.token = body.token;

		return logoutCommand;
	}
}

@injectable()
export class LogoutCommandHandler
	implements RequestHandler<LogoutCommand, Promise<Result<void>>> {
	private readonly _userrepository: IUserRepository;
	constructor(@inject(TYPES.IUserRepository) userRepository: IUserRepository) {
		this._userrepository = userRepository;
	}

	public async handle(request: LogoutCommand): Promise<Result<void>> {
		const validationResult = await validate(request);
		if (validationResult.length > 0) {
			return ActionResult.fail(validationResult.map((x) => x.constraints));
		}

		const userByEmail = await this._userrepository.getByEmail(request.email);
		if (!userByEmail) {
			return ActionResult.fail(
				`user with email: ${request.email} does not exist!`
			);
		}

		const validTokens = userByEmail.tokens.filter(
			async (x) => await argon2.verify(x.token, request.token)
		);

		const token = validTokens[0];

		userByEmail.removeToken(token);

		await this._userrepository.update(userByEmail);

		return ActionResult.ok(undefined);
	}
}
