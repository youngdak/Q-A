import UserId from "@src/domain/users/userId";
import UserDto from "@src/application/users/queries/userDto";
import TagId from "@src/domain/tags/tagId";

export default interface IUserQuery {
	getAll(): Promise<UserDto[]>;
	getById(id: UserId): Promise<UserDto>;
	getByEmail(email: string): Promise<UserDto>;
	getUsersOfTag(id: TagId): Promise<UserDto[]>;
}
