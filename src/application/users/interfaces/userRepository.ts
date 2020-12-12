import User from "../../../domain/users/user";
import UserId from "../../../domain/users/userId";

export default interface IUserRepository {
	userExistById(id: UserId): Promise<boolean>;
	userExistByEmail(email: string): Promise<boolean>;
	getById(id: UserId): Promise<User | undefined>;
	getByEmail(email: string): Promise<User | undefined>;
	save(user: User): Promise<string | number>;
	update(user: User): Promise<string | number>;
	delete(user: User): Promise<void>;
	delete(id: UserId): Promise<void>;
}
