import { injectable } from "inversify";
import IUserRepository from "../../../../application/users/interfaces/userRepository";
import UserId from "../../../../domain/users/userId";
import User from "../../../../domain/users/user";
import { UserMap } from "./userDocument";

@injectable()
export default class UserRepository implements IUserRepository {
	private readonly userMap: UserMap;
	constructor(userMap: UserMap) {
		this.userMap = userMap;
	}

	public async userExistById(id: UserId): Promise<boolean> {
		const userById = await this.userMap.model.findOne({ _id: id.Id });
		return new Promise<boolean>((resolve, _) => {
			userById != null && userById._id == id ? resolve(true) : resolve(false);
		});
	}

	public async userExistByEmail(email: string): Promise<boolean> {
		const userByEmail = await this.userMap.model.findOne({ email: email });

		return new Promise<boolean>((resolve, _) => {
			userByEmail != null && userByEmail.email == email
				? resolve(true)
				: resolve(false);
		});
	}

	public async getById(id: UserId): Promise<User | undefined> {
		const userDocument = await this.userMap.model.findOne({ _id: id.Id });
		return userDocument != undefined ? UserMap.user(userDocument) : undefined;
	}

	public async getByEmail(email: string): Promise<User | undefined> {
		const userDocument = await this.userMap.model.findOne({ email: email });
		return userDocument != undefined ? UserMap.user(userDocument) : undefined;
	}

	public async save(user: User): Promise<string | number> {
		const userDocument = UserMap.userDocument(user);
		await this.userMap.model.create(userDocument);
		return user.id?.Id!;
	}

	public async update(user: User): Promise<string | number> {
		const userDocument = UserMap.userDocument(user);
		await this.userMap.model.updateOne({ _id: user.id?.Id }, userDocument);
		return user.id?.Id!;
	}

	public async delete(user: User): Promise<void>;
	public async delete(userId: UserId): Promise<void>;
	public async delete(param: User | UserId): Promise<void> {
		const id = UserId.ID in param ? param.id : (param as User).id?.Id;
		await this.userMap.model.deleteOne({ _id: id });
	}
}
