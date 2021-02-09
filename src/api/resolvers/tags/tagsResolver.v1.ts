import { inject, injectable } from "inversify";
import { TYPES } from "@src/application/common/types";
import TagServiceLocator from "@src/application/tags/tagServiceLocator";
import { UpdateTagCommand } from "@src/application/tags/commands/updateTagCommand";
import {
	Arg,
	Ctx,
	FieldResolver,
	Mutation,
	Query,
	Resolver,
	ResolverInterface,
	Root,
	UseMiddleware,
} from "type-graphql";
import TagDto from "@src/application/tags/queries/tagDto";
import BaseResolver from "@src/api/common/BaseResolver";
import AuthMiddleware from "@src/application/auth/provider/authMiddleware";
import CustomContext from "@src/application/auth/provider/context";
import { DeleteTagCommand } from "@src/application/tags/commands/deleteTagCommand";
import { CreateTagCommand } from "@src/application/tags/commands/createTagCommand";
import UserDto from "@src/application/users/queries/userDto";
import { GetUsersOfTagQuery } from "@src/application/users/queries/getUsersOfTag";
import UserServiceLocator from "@src/application/users/userServiceLocator";

@injectable()
@Resolver(of => TagDto)
export default class TagsResolver extends BaseResolver implements ResolverInterface<TagDto> {
	private readonly _tagServiceLocator: TagServiceLocator;
	private readonly _userServiceLocator: UserServiceLocator;
	constructor(
		@inject(TYPES.TagServiceLocator) tagServiceLocator: TagServiceLocator,
		@inject(TYPES.UserServiceLocator) userServiceLocator: UserServiceLocator
	) {
		super();
		this._tagServiceLocator = tagServiceLocator;
		this._userServiceLocator = userServiceLocator;
	}

	@UseMiddleware(AuthMiddleware)
	@Query(() => [TagDto], { name: "getAllTags" })
	public async getAllTags(): Promise<TagDto[]> {
		const result = await this._tagServiceLocator
			.getAllTagsQueryHanlder()
			.handle({});

		return this.result(result);
	}

	@UseMiddleware(AuthMiddleware)
	@Query(() => TagDto, { name: "getTagById" })
	public async getById(@Arg("id") id: string): Promise<TagDto> {
		const result = await this._tagServiceLocator
			.getTagByIdQueryHanlder()
			.handle({ id: id });

		return this.result(result);
	}

	@UseMiddleware(AuthMiddleware)
	@Mutation(() => String, { name: "createTag" })
	public async create(
		@Arg("input") input: CreateTagCommand,
		@Ctx() ctx: CustomContext
	): Promise<string | number> {
		input.req = ctx.req;
		const result = await this._tagServiceLocator
			.createTagCommandHanlder()
			.handle(input);

		return this.result(result);
	}

	@UseMiddleware(AuthMiddleware)
	@Mutation(() => String, { name: "updateTag" })
	public async update(
		@Arg("input") input: UpdateTagCommand
	): Promise<string | number> {
		const result = await this._tagServiceLocator
			.updateTagCommandHanlder()
			.handle(input);

		return this.result(result);
	}

	@UseMiddleware(AuthMiddleware)
	@Mutation(() => String, { name: "deleteTag" })
	public async deleteTag(@Arg("input") input: DeleteTagCommand): Promise<void> {
		const result = await this._tagServiceLocator
			.deleteTagCommandHanlder()
			.handle(input);

		return this.result(result);
	}

	@FieldResolver()
	public async users(@Root() tag: TagDto): Promise<UserDto[]> {
		const input = GetUsersOfTagQuery.create({ id: tag.id! });
		const result = await this._userServiceLocator.getUsersOfTagQueryHanlder().handle(input);

		return this.result(result);
	}
}
