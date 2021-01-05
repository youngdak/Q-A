import BaseMap from "@src/persistence/nosql/mongo/baseMap";
import { injectable } from "inversify";
import { mongoose } from "@src/persistence/nosql/mongo/mongoDatabaseSetup";
import UserTag, { IUserTag } from "@src/domain/users/userTag";
import UserTagId from "@src/domain/users/userTagId";

export default interface UserTagDocument extends IUserTag, mongoose.Document {}

@injectable()
export class UserTagMap implements BaseMap<UserTagDocument> {
	schema: mongoose.Schema<any> = new mongoose.Schema({
		_id: {
			type: String,
			required: true,
		},
		userId: {
			type: String,
			required: true,
			ref: "user",
		},
		tagId: {
			type: String,
			required: true,
			ref: "tag",
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
	});

	model: mongoose.Model<UserTagDocument, {}> = mongoose.model<UserTagDocument>(
		"usertag",
		this.schema
	);

	public static userTagDocument(userTag: UserTag): UserTagDocument {
		const userTagDocument = {
			_id: userTag.id?.Id,
			userId: userTag.userId,
			tagId: userTag.tagId,
			createdBy: userTag.createdBy,
			createdDate: userTag.createdDate,
		};

		return userTagDocument as UserTagDocument;
	}

	public static userTag(userTagDocument: UserTagDocument): UserTag {
		var userTagId = UserTagId.create(userTagDocument.id);
		const userTag = UserTag.create(
			userTagDocument.userId,
			userTagDocument.tagId,
			userTagDocument.createdBy,
			userTagDocument.createdDate,
			userTagId
		).data;

		return userTag;
	}
}
