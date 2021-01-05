import User from "@src/domain/users/user";
import UserId from "@src/domain/users/userId";
import UserTag from "@src/domain/users/userTag";
import UserTagId from "@src/domain/users/userTagId";

export default interface IUserRepository {
	userExistById(id: UserId): Promise<boolean>;
	userExistByEmail(email: string): Promise<boolean>;
	userTags(userId: UserId): Promise<UserTag[]>;
	getById(id: UserId): Promise<User | undefined>;
	getByEmail(email: string): Promise<User | undefined>;
	save(user: User): Promise<string | number>;
	update(user: User): Promise<string | number>;
	delete(user: User): Promise<void>;
	delete(id: UserId): Promise<void>;
	saveUserTag(userTag: UserTag): Promise<string | number>;
	saveUserTags(userTags: UserTag[]): Promise<void>;
	deleteUserTags(userTags: UserTag[]): Promise<void>;
	deleteUserTag(user: UserTag): Promise<void>;
	deleteUserTag(id: UserTagId): Promise<void>;
}
