import Tag, { ITag } from "@src/domain/tags/tag";
import { Entity, Column, PrimaryColumn } from "typeorm";
import TagId from "@src/domain/tags/tagId";

@Entity("Tag")
export default class TagMap implements ITag {
	@PrimaryColumn()
	id: string;

	@Column()
	name: string;

	@Column()
	description: string;

	@Column()
	createdBy: string;

	@Column()
	createdDate: Date;

	public static tagMap(tag: Tag): TagMap {
		const tagMap = new TagMap();
		tagMap.id = tag.id?.Id as string;
		tagMap.name = tag.name;
		tagMap.description = tag.description;
		tagMap.createdBy = tag.createdBy;
		tagMap.createdDate = tag.createdDate;

		return tagMap;
	}

	public static tag(tagMap: TagMap): Tag {
		var tagId = TagId.create(tagMap.id);
		const tag = Tag.create(
			tagMap.name,
			tagMap.description,
			tagMap.createdBy,
			tagMap.createdDate,
			tagId
		).data;

		return tag;
	}
}
