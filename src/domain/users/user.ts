import EntityBase, { IEntityBase } from "@src/domain/entitybase/entitybase";
import UserId from "@src/domain/users/userId";
import { v4 as uuidv4 } from "uuid";
import Result from "@src/domain/common/result";
import ActionResult from "@src/domain/common/actionresult";

export interface IUser extends IEntityBase {
	firstName: string;
	lastName: string;
	otherName: string;
	email: string;
	password: string;
}

export default class User extends EntityBase<UserId> implements IUser {
	public static readonly EntityName = "User";
	private _firstName: string;
	private _lastName: string;
	private _otherName: string;
	private _email: string;
	private _password: string;

	private constructor(
		userId: UserId,
		firstName: string,
		lastName: string,
		otherName: string,
		email: string,
		password: string,
		createdBy: string,
		createdDate?: Date
	) {
		super(createdBy, createdDate);
		this._firstName = firstName;
		this._lastName = lastName;
		this._otherName = otherName;
		this._email = email;
		this._password = password;

		this._id = userId;
	}

	public get firstName(): string {
		return this._firstName;
	}

	public get lastName(): string {
		return this._lastName;
	}

	public get otherName(): string {
		return this._otherName;
	}

	public get email(): string {
		return this._email;
	}

	public get password(): string {
		return this._password;
	}

	public update(
		firstName: string,
		lastName: string,
		otherName: string
	): Result<void> {
		if (firstName == undefined || firstName == null || firstName.length <= 0) {
			return ActionResult.fail("first name should not be null or empty");
		}

		if (lastName == undefined || lastName == null || lastName.length <= 0) {
			return ActionResult.fail("last name should not be null or empty");
		}

		this._firstName = firstName;
		this._lastName = lastName;
		this._otherName = otherName;

		return ActionResult.ok(undefined);
	}

	public static create(
		firstName: string,
		lastName: string,
		otherName: string,
		email: string,
		password: string,
		createdBy: string
	): Result<User>;
	public static create(
		firstName: string,
		lastName: string,
		otherName: string,
		email: string,
		password: string,
		createdBy: string,
		createdDate: Date,
		userId: UserId
	): Result<User>;
	public static create(
		firstName: string,
		lastName: string,
		otherName: string,
		email: string,
		password: string,
		createdBy: string,
		createdDate?: Date,
		userId?: UserId
	): Result<User> {
		if (firstName == undefined || firstName == null || firstName.length <= 0) {
			return ActionResult.fail("first name should not be null or empty");
		}

		if (lastName == undefined || lastName == null || lastName.length <= 0) {
			return ActionResult.fail("last name should not be null or empty");
		}

		if (email == undefined || email == null || email.length <= 0) {
			return ActionResult.fail("email should not be null or empty");
		}

		if (password == undefined || password == null || password.length <= 0) {
			return ActionResult.fail("password should not be null or empty");
		}

		if (createdBy == undefined || createdBy == null || createdBy.length <= 0) {
			return ActionResult.fail("created by should not be null or empty");
		}

		const id = userId ?? UserId.create(uuidv4());
		var user = createdDate
			? new User(
					id,
					firstName,
					lastName,
					otherName,
					email,
					password,
					createdBy,
					createdDate
			  )
			: new User(
					id,
					firstName,
					lastName,
					otherName,
					email,
					password,
					createdBy
			  );
		return ActionResult.ok(user);
	}
}
