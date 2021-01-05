import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class AssignTagsToUserCommandDto {
	@Field(type => [String])
	public succeded: string[];

	@Field(type => [KeyValuePair])
	public failed: KeyValuePair[];
}

@ObjectType()
export class KeyValuePair {
	@Field()
	public key: string;

	@Field()
	public value: string;
}
