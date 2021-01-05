import { inject, injectable } from "inversify";
import IUserRepository from "@src/application/users/interfaces/userRepository";
import { LoginCommandHandler } from "@src/application/auth/commands/loginCommand";
import { RegisterCommandHandler } from "@src/application/auth/commands/registerCommand";
import { LogoutCommandHandler } from "@src/application/auth/commands/logoutCommand";
import { TYPES } from "@src/application/common/types";

@injectable()
export default class AuthServiceLocator {
	private readonly _userRepository: IUserRepository;
	constructor(@inject(TYPES.IUserRepository) userRepository: IUserRepository) {
		this._userRepository = userRepository;
	}

	public registerCommandHanlder(): RegisterCommandHandler {
		return new RegisterCommandHandler(this._userRepository);
	}

	public loginCommandHanlder(): LoginCommandHandler {
		return new LoginCommandHandler(this._userRepository);
	}

	public logoutCommandHanlder(): LogoutCommandHandler {
		return new LogoutCommandHandler(this._userRepository);
	}
}
