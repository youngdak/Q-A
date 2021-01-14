import { injectable } from "inversify";
import IUserRepository from "@src/application/users/interfaces/userRepository";
import UserId from "@src/domain/users/userId";
import User from "@src/domain/users/user";
import { UserMap } from "@src/persistence/nosql/mongo/users/userDocument";
import UserTag from "@src/domain/users/userTag";
import { UserTagMap } from "@src/persistence/nosql/mongo/users/userTagDocument";
import UserTagId from "@src/domain/users/userTagId";

@injectable()
export default class UserRepository implements IUserRepository {
	private readonly userMap: UserMap;
	private readonly userTagMap: UserTagMap;

	constructor(userMap: UserMap, userTagMap: UserTagMap) {
		this.userMap = userMap;
		this.userTagMap = userTagMap;
	}

	public async login(email: string): Promise<[id: string, password: string] | undefined> {
		const userMap = await this.userMap.model.findOne({ email: email }, "id, password");
		return userMap != undefined ? [userMap.id, userMap.password] : undefined;
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

	public async userTags(userId: UserId): Promise<UserTag[]> {
		const userTagDocuments = await this.userTagMap.model.find({
			userId: userId.Id,
		});

		var userTags = userTagDocuments.map((userTagDocument) =>
			UserTagMap.userTag(userTagDocument)
		);

		return userTags;
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

	public async saveUserTag(userTag: UserTag): Promise<string | number> {
		const userTagDocument = UserTagMap.userTagDocument(userTag);
		await this.userTagMap.model.create(userTagDocument);
		return userTag.id?.Id!;
	}

	public async saveUserTags(userTags: UserTag[]): Promise<void> {
		for (let i = 0; i < userTags.length; i++) {
			const userTag = userTags[i];
			const userTagDocument = UserTagMap.userTagDocument(userTag);
			await this.userTagMap.model.create(userTagDocument);
		}
	}

	public async deleteUserTags(userTags: UserTag[]): Promise<void> {
		for (let i = 0; i < userTags.length; i++) {
			const userTag = userTags[i];
			const userTagDocument = UserTagMap.userTagDocument(userTag);
			await this.userTagMap.model.deleteOne(userTagDocument);
		}
	}

	public async deleteUserTag(userTag: UserTag): Promise<void>;
	public async deleteUserTag(userTagId: UserTagId): Promise<void>;
	public async deleteUserTag(param: UserTag | UserTagId): Promise<void> {
		const id = UserId.ID in param ? param.id : (param as UserTag).id?.Id;
		await this.userTagMap.model.deleteOne({ _id: id });
	}
}
