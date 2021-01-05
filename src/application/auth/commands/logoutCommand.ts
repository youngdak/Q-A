import Request from "@src/application/interfaces/request";
import RequestHandler from "@src/application/interfaces/requesthandler";
import { validate, IsNotEmpty, IsString, IsEmail } from "class-validator";
import { injectable, inject } from "inversify";
import Result from "@src/domain/common/result";
import ActionResult from "@src/domain/common/actionresult";
import IUserRepository from "@src/application/users/interfaces/userRepository";
import { TYPES } from "@src/application/common/types";

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

		await this._userrepository.update(userByEmail);

		return ActionResult.ok(undefined);
	}
}
