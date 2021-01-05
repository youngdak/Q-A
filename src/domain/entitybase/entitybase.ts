import StringIdentity from "@src/domain/entitybase/stringIdentity";

export interface IEntityBase {
	createdDate: Date;
	createdBy: string;
}

export default abstract class EntityBase<TId extends StringIdentity>
	implements IEntityBase {
	protected _id: TId | null;
	protected _createdDate: Date;
	protected _createdBy: string;

	protected constructor(createdBy: string, createdDate?: Date) {
		this._id = null;
		this._createdDate = createdDate ?? new Date();
		this._createdBy = createdBy;
	}

	public get id(): TId | null {
		return this._id;
	}

	public get createdBy(): string {
		return this._createdBy;
	}

	public get createdDate(): Date {
		return this._createdDate;
	}
}
