import EntityBase, { IEntityBase } from "@src/domain/entitybase/entitybase";
import UserTagId from "@src/domain/users/userTagId";
import { v4 as uuidv4 } from "uuid";
import Result from "@src/domain/common/result";
import ActionResult from "@src/domain/common/actionresult";
import Guard, { GuardMessage } from "@src/domain/common/guard";

export interface IUserTag extends IEntityBase {
	userId: string;
	tagId: string;
}

export default class UserTag extends EntityBase<UserTagId> implements IUserTag {
	private _user: string;
	private _tag: string;

	private constructor(
		tagId: UserTagId,
		user: string,
		tag: string,
		createdBy: string,
		createdDate?: Date
	) {
		super(createdBy, createdDate);
		this._id = tagId;
		this._user = user;
		this._tag = tag;
	}

	public get userId(): string {
		return this._user;
	}

	public get tagId(): string {
		return this._tag;
	}

	public static create(
		user: string,
		tag: string,
		createdBy: string
	): Result<UserTag>;
	public static create(
		user: string,
		tag: string,
		createdBy: string,
		createdDate: Date,
		tagId: UserTagId
	): Result<UserTag>;
	public static create(
		user: string,
		tag: string,
		createdBy: string,
		createdDate?: Date,
		tagId?: UserTagId
	): Result<UserTag> {
		if (Guard.isNotNullEmptyOrWhitespace(user)) {
			return ActionResult.fail(
				GuardMessage.isNotNullEmptyOrWhitespace("user id")
			);
		}

		if (Guard.isNotNullEmptyOrWhitespace(tag)) {
			return ActionResult.fail(
				GuardMessage.isNotNullEmptyOrWhitespace("tag id")
			);
		}

		if (Guard.isNotNullEmptyOrWhitespace(createdBy)) {
			return ActionResult.fail(
				GuardMessage.isNotNullEmptyOrWhitespace("createdby")
			);
		}

		const id = tagId ?? UserTagId.create(uuidv4());
		var userTag = createdDate
			? new UserTag(id, user, tag, createdBy, createdDate)
			: new UserTag(id, user, tag, createdBy);

		return ActionResult.ok(userTag);
	}
}
