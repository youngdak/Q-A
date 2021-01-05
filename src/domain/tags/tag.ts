import EntityBase, { IEntityBase } from "@src/domain/entitybase/entitybase";
import TagId from "@src/domain/tags/tagId";
import { v4 as uuidv4 } from "uuid";
import Result from "@src/domain/common/result";
import ActionResult from "@src/domain/common/actionresult";

export interface ITag extends IEntityBase {
	name: string;
	description: string;
}

export default class Tag extends EntityBase<TagId> implements ITag {
	private _name: string;
	private _description: string;

	private constructor(
		tagId: TagId,
		name: string,
		description: string,
		createdBy: string,
		createdDate?: Date
	) {
		super(createdBy, createdDate);
		this._name = name;
		this._description = description;
		this._id = tagId;
	}

	public get name(): string {
		return this._name;
	}

	public get description(): string {
		return this._description;
	}

	public update(name: string, description: string): Result<void> {
		if (name == undefined || name == null || name.length <= 0) {
			return ActionResult.fail("name should not be null or empty");
		}

		if (
			description == undefined ||
			description == null ||
			description.length <= 0
		) {
			return ActionResult.fail("description should not be null or empty");
		}

		this._name = name;
		this._description = description;

		return ActionResult.ok(undefined);
	}

	public static create(
		name: string,
		description: string,
		createdBy: string
	): Result<Tag>;
	public static create(
		name: string,
		description: string,
		createdBy: string,
		createdDate: Date,
		tagId: TagId
	): Result<Tag>;
	public static create(
		name: string,
		description: string,
		createdBy: string,
		createdDate?: Date,
		tagId?: TagId
	): Result<Tag> {
		if (name == undefined || name == null || name.length <= 0) {
			return ActionResult.fail("name should not be null or empty");
		}

		if (
			description == undefined ||
			description == null ||
			description.length <= 0
		) {
			return ActionResult.fail("description should not be null or empty");
		}

		if (createdBy == undefined || createdBy == null || createdBy.length <= 0) {
			return ActionResult.fail("created by should not be null or empty");
		}

		const id = tagId ?? TagId.create(uuidv4());
		var tag = createdDate
			? new Tag(id, name, description, createdBy, createdDate)
			: new Tag(id, name, description, createdBy);
		return ActionResult.ok(tag);
	}
}
