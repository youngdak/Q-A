import { inject, injectable } from "inversify";
import { TYPES } from "../common/types";
import IUserRepository from "../users/interfaces/userRepository";
import { LoginCommandHandler } from "./commands/loginCommand";
import { RegisterCommandHandler } from "./commands/registerCommand";
import { LogoutCommandHandler } from "./commands/logoutCommand";
import { LogoutAllCommandHandler } from "./commands/logoutAllCommand";

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

	public logoutAllCommandHanlder(): LogoutAllCommandHandler {
		return new LogoutAllCommandHandler(this._userRepository);
	}
}
