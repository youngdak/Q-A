import User, { IUser } from "../../../../domain/users/user";
import BaseMap from "../baseMap";
import UserId from "../../../../domain/users/userId";
import { injectable } from "inversify";
import UserToken, { IUserToken } from "../../../../domain/users/userToken";
import UserTag, { IUserTag } from "../../../../domain/users/userTag";
import { mongoose } from "../mongoDatabaseSetup";

export default interface UserDocument extends IUser, mongoose.Document {
	tokens: IUserToken[];
	tags: IUserTag[];
}

@injectable()
export class UserMap implements BaseMap<UserDocument> {
	schema: mongoose.Schema<any> = new mongoose.Schema(
		{
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
				required: true,
				trim: true,
			},
			email: {
				type: String,
				required: true,
				trim: true,
			},
			password: {
				type: String,
				required: true,
				trim: true,
			},
			tokens: [
				{
					_id: {
						type: String,
						required: true,
					},
					token: {
						type: String,
						required: true,
					},
					refreshToken: {
						type: String,
						required: true,
					},
					device: {
						type: String,
						required: true,
					},
				},
			],
			tags: [
				{
					_id: {
						type: String,
						required: true,
					},
					name: {
						type: String,
						required: true,
					},
				},
			],
		},
		{
			timestamps: true,
		}
	);

	model: mongoose.Model<UserDocument, {}> = mongoose.model<UserDocument>(
		"user",
		this.schema
	);

	public static userDocument(user: User): UserDocument {
		const userDoc = {
			_id: user.id?.Id,
			firstName: user.firstName,
			lastName: user.lastName,
			otherName: user.otherName,
			email: user.email,
			password: user.password,
			tokens: user.tokens.map<IUserToken>((x) => this.userTokenDocument(x)),
			tags: user.tags.map<IUserTag>((x) => this.userTagDocument(x)),
		};
		return userDoc as UserDocument;
	}

	private static userTokenDocument(userToken: UserToken): IUserToken {
		const userTokenDocument = {
			_id: userToken.id?.Id,
			token: userToken.token,
			refreshToken: userToken.refreshToken,
			device: userToken.device,
		} as IUserToken;
		return userTokenDocument;
	}

	private static userTagDocument(userTag: UserTag): IUserTag {
		const userTagDocument = {
			_id: userTag.id?.Id,
			name: userTag.name,
		} as IUserTag;
		return userTagDocument;
	}

	public static user(userDocument: UserDocument): User {
		var userId = UserId.create(userDocument.id);
		const user = User.create(
			userDocument.firstName,
			userDocument.lastName,
			userDocument.otherName,
			userDocument.email,
			userDocument.password,
			userId
		).data;
		return user;
	}
}
