import { Request, Response } from "express";
import { inject } from "inversify";
import {
	controller,
	httpPost,
	request,
	response,
} from "inversify-express-utils";
import { TYPES } from "@src/application/common/types";
import BaseController from "@src/api/common/baseController";
import AuthServiceLocator from "@src/application/auth/authServiceLocator";
import { LoginCommand } from "@src/application/auth/commands/loginCommand";
import { RegisterCommand } from "@src/application/auth/commands/registerCommand";
import AuthMiddleware from "@src/application/auth/provider/authMiddleware";
import { LogoutCommand } from "@src/application/auth/commands/logoutCommand";
import PassportMiddleware from "@src/application/auth/provider/passportMiddleware";

@controller("/account")
export default class AccountController extends BaseController {
	private readonly _authServiceLocator: AuthServiceLocator;
	constructor(
		@inject(TYPES.AuthServiceLocator) authServiceLocator: AuthServiceLocator
	) {
		super();
		this._authServiceLocator = authServiceLocator;
	}

	@httpPost("/register")
	public async post(@request() req: Request) {
		const registerCommand = RegisterCommand.create(req.body);
		const result = await this._authServiceLocator
			.registerCommandHanlder()
			.handle(registerCommand);

		return this.result(result);
	}

	@httpPost("/login")
	public async login(@request() req: Request, @response() res: Response) {
		const loginCommand = LoginCommand.create(req.body);
		const result = await this._authServiceLocator
			.loginCommandHanlder()
			.handle(loginCommand);

		if (result.success) {
			res.cookie("jwt", result.data.token, PassportMiddleware.cookieOptions());
		}

		return this.result(result);
	}

	@httpPost("/logout", AuthMiddleware)
	public async logout() {
		const logoutCommand = LogoutCommand.create(this.httpContext.user.details);
		const result = await this._authServiceLocator
			.logoutCommandHanlder()
			.handle(logoutCommand);

		return this.result(result);
	}
}
