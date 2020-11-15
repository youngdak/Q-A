import User from "../../../domain/users/user";

export default class UserDto {
	public id: string | undefined;
	public firstName: string | undefined;
	public lastName: string | undefined;
	public otherName: string | undefined;
	public email: string | undefined;

	public static userDto(user: User): UserDto {
		return {
			id: user.id?.Id!,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			otherName: user.otherName,
		};
	}
}
