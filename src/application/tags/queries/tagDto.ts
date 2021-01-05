import { Field, ObjectType } from "type-graphql";
import Tag from "@src/domain/tags/tag";

@ObjectType()
export default class TagDto {
	@Field()
	public id: string;

	@Field()
	public name: string;

	@Field()
	public description: string;

	public static tagDto(tag: Tag): TagDto {
		return {
			id: tag.id?.Id!,
			name: tag.name,
			description: tag.description,
		};
	}
}
