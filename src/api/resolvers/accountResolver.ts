import { inject, injectable } from "inversify";
import { TYPES } from "@src/application/common/types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import BaseResolver from "@src/api/common/BaseResolver";
import AuthServiceLocator from "@src/application/auth/authServiceLocator";
import { RegisterCommand } from "@src/application/auth/commands/registerCommand";
import { LoginCommand } from "@src/application/auth/commands/loginCommand";
import LoginDto from "@src/application/auth/commands/loginDto";
import CustomContext from "@src/application/auth/provider/context";
import PassportMiddleware from "@src/application/auth/provider/passportMiddleware";

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
