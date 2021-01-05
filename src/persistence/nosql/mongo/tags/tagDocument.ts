import Tag from "@src/domain/tags/tag";
import BaseMap from "@src/persistence/nosql/mongo/baseMap";
import TagId from "@src/domain/tags/tagId";
import { injectable } from "inversify";
import { mongoose } from "@src/persistence/nosql/mongo/mongoDatabaseSetup";
import { ITag } from "@src/domain/tags/tag";

export default interface TagDocument extends ITag, mongoose.Document {}

@injectable()
export class TagMap implements BaseMap<TagDocument> {
	schema: mongoose.Schema<any> = new mongoose.Schema({
		_id: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		description: {
			type: String,
			required: true,
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

	model: mongoose.Model<TagDocument, {}> = mongoose.model<TagDocument>(
		"tag",
		this.schema
	);

	public static tagDocument(tag: Tag): TagDocument {
		const tagDoc = {
			_id: tag.id?.Id,
			name: tag.name,
			description: tag.description,
			createdBy: tag.createdBy,
			createdDate: tag.createdDate,
		};

		return tagDoc as TagDocument;
	}

	public static tag(tagDocument: TagDocument): Tag {
		var tagId = TagId.create(tagDocument.id);
		const tag = Tag.create(
			tagDocument.name,
			tagDocument.description,
			tagDocument.createdBy,
			tagDocument.createdDate,
			tagId
		).data;

		return tag;
	}
}
