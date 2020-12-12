import { inject, injectable } from "inversify";
import { TYPES } from "../../../application/common/types";
import UserServiceLocator from "../../../application/users/userServiceLocator";
import { UpdateUserCommand } from "../../../application/users/commands/updateUserCommand";
import {
	Arg,
	Ctx,
	Mutation,
	Query,
	Resolver,
	UseMiddleware,
} from "type-graphql";
import UserDto from "../../../application/users/queries/userDto";
import BaseResolver from "../../common/BaseResolver";
import AuthMiddleware from "../../../application/auth/provider/authMiddleware";
import CustomContext from "../../../application/auth/provider/context";

@injectable()
@Resolver()
export default class UsersResolver extends BaseResolver {
	private readonly _userServiceLocator: UserServiceLocator;
	constructor(
		@inject(TYPES.UserServiceLocator) userServiceLocator: UserServiceLocator
	) {
		super();
		this._userServiceLocator = userServiceLocator;
	}

	@UseMiddleware(AuthMiddleware)
	@Query(() => UserDto, { name: "profile" })
	public async getUserProfile(@Ctx() ctx: CustomContext): Promise<UserDto> {
		const user = UserDto.userDtoFromExpress(ctx.req.user!);
		return this.result(user);
	}

	@UseMiddleware(AuthMiddleware)
	@Query(() => UserDto, { name: "getById" })
	public async getById(@Arg("id") id: string): Promise<UserDto> {
		const result = await this._userServiceLocator
			.getUserByIdQueryHanlder()
			.handle({ id: id });

		return this.result(result);
	}

	@UseMiddleware(AuthMiddleware)
	@Mutation(() => String, { name: "update" })
	public async update(
		@Arg("input") input: UpdateUserCommand
	): Promise<string | number> {
		const result = await this._userServiceLocator
			.updateUserCommandHanlder()
			.handle(input);

		return this.result(result);
	}
}
