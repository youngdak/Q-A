import User, { IUser } from "@src/domain/users/user";
import BaseMap from "@src/persistence/nosql/mongo/baseMap";
import UserId from "@src/domain/users/userId";
import { injectable } from "inversify";
import { mongoose } from "@src/persistence/nosql/mongo/mongoDatabaseSetup";

export default interface UserDocument extends IUser, mongoose.Document {}

@injectable()
export class UserMap implements BaseMap<UserDocument> {
	schema: mongoose.Schema<any> = new mongoose.Schema({
		_id: {
			type: String,
			required: true,
		},
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
		otherName: {
			type: String,
			required: false,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
		},
		createdBy: {
			type: String,
			required: true,
			trim: true,
		},
		createdDate: {
			type: Date,
			required: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
	});

	model: mongoose.Model<UserDocument, {}> = mongoose.model<UserDocument>(
		"user",
		this.schema
	);

	public static userDocument(user: User): UserDocument {
		const userDocument = {
			_id: user.id?.Id,
			firstName: user.firstName,
			lastName: user.lastName,
			otherName: user.otherName,
			email: user.email,
			password: user.password,
			createdBy: user.createdBy,
			createdDate: user.createdDate,
		};

		return userDocument as UserDocument;
	}

	public static user(userDocument: UserDocument): User {
		var userId = UserId.create(userDocument._id);
		const user = User.create(
			userDocument.firstName,
			userDocument.lastName,
			userDocument.otherName,
			userDocument.email,
			userDocument.password,
			userDocument.createdBy,
			userDocument.createdDate,
			userId
		).data;

		return user;
	}
}
