import { Field, ObjectType } from "type-graphql";
import Tag from "@src/domain/tags/tag";
import UserDto from "@src/application/users/queries/userDto";

@ObjectType()
export default class TagDto {
	@Field()
	public id: string;

	@Field()
	public name: string;

	@Field()
	public description: string;

	@Field(type => [UserDto])
	public users: UserDto[];

	public static tagDto(tag: Tag): TagDto {
		return {
			id: tag.id?.Id!,
			name: tag.name,
			description: tag.description,
			users: []
		};
	}
}
