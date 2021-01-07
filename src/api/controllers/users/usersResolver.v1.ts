import { inject, injectable } from "inversify";
import { TYPES } from "@src/application/common/types";
import UserServiceLocator from "@src/application/users/userServiceLocator";
import { UpdateUserCommand } from "@src/application/users/commands/updateUserCommand";
import {
	Arg,
	Ctx,
	Mutation,
	Query,
	Resolver,
	UseMiddleware,
} from "type-graphql";
import UserDto from "@src/application/users/queries/userDto";
import BaseResolver from "@src/api/common/BaseResolver";
import AuthMiddleware from "@src/application/auth/provider/authMiddleware";
import CustomContext from "@src/application/auth/provider/context";
import { AssignTagsToUserCommand } from "@src/application/users/commands/assignTagsToUserCommand";
import AssignTagsToUserCommandDto from "@src/application/users/commands/assignTagsToUserCommandDto";

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
	@Query(() => UserDto, { name: "getUserById" })
	public async getById(@Arg("id") id: string): Promise<UserDto> {
		const result = await this._userServiceLocator
			.getUserByIdQueryHanlder()
			.handle({ id: id });

		return this.result(result);
	}

	@UseMiddleware(AuthMiddleware)
	@Mutation(() => String, { name: "updateUser" })
	public async update(
		@Arg("input") input: UpdateUserCommand
	): Promise<string | number> {
		const result = await this._userServiceLocator
			.updateUserCommandHanlder()
			.handle(input);

		return this.result(result);
	}

	@UseMiddleware(AuthMiddleware)
	@Mutation(() => AssignTagsToUserCommandDto, { name: "tagUser" })
	public async tagUser(
		@Arg("input") input: AssignTagsToUserCommand,
		@Ctx() ctx: CustomContext
	): Promise<AssignTagsToUserCommandDto> {
		input.req = ctx.req;

		const result = await this._userServiceLocator
			.assignTagsToUserCommandHanlder()
			.handle(input);

		return this.result(result);
	}
}
