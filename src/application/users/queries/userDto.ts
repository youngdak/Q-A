import { Field, ObjectType } from "type-graphql";
import User from "@src/domain/users/user";
import Result from "@src/domain/common/result";
import ActionResult from "@src/domain/common/actionresult";

@ObjectType()
export default class UserDto {
	@Field()
	public id: string;

	@Field()
	public firstName: string;

	@Field()
	public lastName: string;

	@Field()
	public otherName: string;

	@Field()
	public email: string;

	public static userDto(user: User): UserDto {
		return {
			id: user.id?.Id!,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			otherName: user.otherName,
		};
	}

	public static userDtoFromExpress(expUser: Express.User): Result<UserDto> {
		if (!expUser) return ActionResult.fail("user not found!");

		var user = expUser as User;
		const userDto = {
			id: user.id?.Id!,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			otherName: user.otherName,
		};

		return ActionResult.ok(userDto);
	}
}
