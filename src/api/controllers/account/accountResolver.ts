import { inject, injectable } from "inversify";
import { TYPES } from "../../../application/common/types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import BaseResolver from "../../common/BaseResolver";
import AuthServiceLocator from "../../../application/auth/authServiceLocator";
import { RegisterCommand } from "../../../application/auth/commands/registerCommand";
import { LoginCommand } from "../../../application/auth/commands/loginCommand";
import LoginDto from "../../../application/auth/commands/loginDto";
import CustomContext from "../../../application/auth/provider/context";
import PassportMiddleware from "../../../application/auth/provider/passportMiddleware";

@injectable()
@Resolver()
export default class AccountResolver extends BaseResolver {
	private readonly _authServiceLocator: AuthServiceLocator;
	constructor(
		@inject(TYPES.AuthServiceLocator) authServiceLocator: AuthServiceLocator
	) {
		super();
		this._authServiceLocator = authServiceLocator;
	}

	@Mutation(() => LoginDto, { name: "login" })
	public async login(
		@Arg("input") input: LoginCommand,
		@Ctx() ctx: CustomContext
	): Promise<LoginDto> {
		const result = await this._authServiceLocator
			.loginCommandHanlder()
			.handle(input);

		if (result.success) {
			ctx.res.cookie(
				"jwt",
				result.data.token,
				PassportMiddleware.cookieOptions()
			);
		}

		return this.result(result);
	}

	@Mutation(() => String, { name: "register" })
	public async register(
		@Arg("input") input: RegisterCommand
	): Promise<string | number> {
		const result = await this._authServiceLocator
			.registerCommandHanlder()
			.handle(input);

		return this.result(result);
	}
}
