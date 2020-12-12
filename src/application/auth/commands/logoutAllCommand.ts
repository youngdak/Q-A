import Request from "../../interfaces/request";
import RequestHandler from "../../interfaces/requesthandler";
import { validate, IsEmail } from "class-validator";
import { injectable, inject } from "inversify";
import Result from "../../../domain/common/result";
import ActionResult from "../../../domain/common/actionresult";
import { TYPES } from "../../common/types";
import IUserRepository from "../../users/interfaces/userRepository";

export class LogoutAllCommand implements Request<Promise<Result<void>>> {
	@IsEmail()
	public email: string;

	public static create(body: { email: string }): LogoutAllCommand {
		var logoutAllCommand = new LogoutAllCommand();
		logoutAllCommand.email = body.email;

		return logoutAllCommand;
	}
}

@injectable()
export class LogoutAllCommandHandler
	implements RequestHandler<LogoutAllCommand, Promise<Result<void>>> {
	private readonly _userrepository: IUserRepository;
	constructor(@inject(TYPES.IUserRepository) userRepository: IUserRepository) {
		this._userrepository = userRepository;
	}

	public async handle(request: LogoutAllCommand): Promise<Result<void>> {
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

		userByEmail.removeAllTokens();

		await this._userrepository.update(userByEmail);

		return ActionResult.ok(undefined);
	}
}
