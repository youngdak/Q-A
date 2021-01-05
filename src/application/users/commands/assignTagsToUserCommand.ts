import Request from "@src/application/interfaces/request";
import RequestHandler from "@src/application/interfaces/requesthandler";
import { validate, IsNotEmpty, IsArray } from "class-validator";
import IUserRepository from "@src/application/users/interfaces/userRepository";
import { injectable, inject } from "inversify";
import Result from "@src/domain/common/result";
import ActionResult from "@src/domain/common/actionresult";
import { Field, InputType } from "type-graphql";
import TagId from "@src/domain/tags/tagId";
import ITagRepository from "@src/application/tags/interfaces/tagRepository";
import UserTag from "@src/domain/users/userTag";
import * as exp from "express";
import AssignTagsToUserCommandDto, {
	KeyValuePair,
} from "@src/application/users/commands/assignTagsToUserCommandDto";
import User from "@src/domain/users/user";
import _ from "lodash";
import { TYPES } from "@src/application/common/types";

@InputType()
export class AssignTagsToUserCommand
	implements Request<Promise<Result<AssignTagsToUserCommandDto>>> {
	@Field(() => [String])
	@IsNotEmpty()
	@IsArray()
	public tagIds: string[];

	public req: exp.Request;

	public static create(body: { tagIds: string[] }): AssignTagsToUserCommand {
		var assignTagsToUserCommand = new AssignTagsToUserCommand();
		assignTagsToUserCommand.tagIds = body.tagIds;

		return assignTagsToUserCommand;
	}
}

@injectable()
export class AssignTagsToUserCommandHandler
	implements
		RequestHandler<
			AssignTagsToUserCommand,
			Promise<Result<AssignTagsToUserCommandDto>>
		> {
	private readonly _userrepository: IUserRepository;
	private readonly _tagrepository: ITagRepository;
	constructor(
		@inject(TYPES.IUserRepository) userRepository: IUserRepository,
		@inject(TYPES.ITagRepository) tagRepository: ITagRepository
	) {
		this._userrepository = userRepository;
		this._tagrepository = tagRepository;
	}

	public async handle(
		request: AssignTagsToUserCommand
	): Promise<Result<AssignTagsToUserCommandDto>> {
		const validationResult = await validate(request);
		if (validationResult.length > 0) {
			return ActionResult.fail(validationResult.map((x) => x.constraints));
		}

		const failedTags: KeyValuePair[] = [];
		const validTags: UserTag[] = [];

		var user = request.req.user as User;
		const existingTags = await this._userrepository.userTags(user.id!);
		const incomingTagIds = request.tagIds;
		const existingTagIds = existingTags.map((x) => x.tagId);
		const distinct = _.intersectionWith(
			incomingTagIds,
			existingTagIds,
			_.isEqual
		);
		const removing = _.differenceWith(existingTagIds, distinct, _.isEqual);
		const adding = _.differenceWith(incomingTagIds, distinct, _.isEqual);

		for (let i = 0; i < adding.length; i++) {
			const tagId = adding[i];
			const tagIdObj = TagId.create(tagId);
			const tag = await this._tagrepository.tagExistById(tagIdObj);
			if (!tag) {
				failedTags.push(this.NewKeyValuePair(tagId, "tag does not exist"));
			} else {
				const tagObj = UserTag.create(user.id?.Id!, tagId, user.email);
				validTags.push(tagObj.data);
			}
		}

		var removingUserTags = existingTags.filter((x) =>
			removing.includes(x.tagId)
		);

		await this._userrepository.deleteUserTags(removingUserTags);
		await this._userrepository.saveUserTags(validTags);

		const assignTagsToUserCommandDto = new AssignTagsToUserCommandDto();
		assignTagsToUserCommandDto.failed = failedTags;
		assignTagsToUserCommandDto.succeded = validTags.map((x) => x.tagId);
		assignTagsToUserCommandDto.succeded.push(...distinct);

		return ActionResult.ok(assignTagsToUserCommandDto);
	}

	private NewKeyValuePair(key: string, value: string): KeyValuePair {
		var newKeyValuePair = new KeyValuePair();
		newKeyValuePair.key = key;
		newKeyValuePair.value = value;

		return newKeyValuePair;
	}
}
