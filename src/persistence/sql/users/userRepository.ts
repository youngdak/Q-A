import { EntityRepository, EntityManager } from "typeorm";
import UserMap from "@src/persistence/sql/users/user.map";
import IUserRepository from "@src/application/users/interfaces/userRepository";
import User from "@src/domain/users/user";
import UserId from "@src/domain/users/userId";
import { injectable } from "inversify";
import UserTag from "@src/domain/users/userTag";
import UserTagMap from "@src/persistence/sql/users/userTag.map";
import UserTagId from "@src/domain/users/userTagId";

@EntityRepository()
@injectable()
export default class UserRepository implements IUserRepository {
	private readonly manager: EntityManager;
	constructor(manager: EntityManager) {
		this.manager = manager;
	}

	public async userExistById(id: UserId): Promise<boolean> {
		const userId = await this.manager
			.createQueryBuilder(UserMap, "user")
			.select("user.id")
			.where("user.id = :id", { id: id })
			.getRawOne();

		return new Promise<boolean>((resolve, _) => {
			userId != undefined && userId.user_id == id
				? resolve(true)
				: resolve(false);
		});
	}

	public async userExistByEmail(email: string): Promise<boolean> {
		const userEmail = await this.manager
			.createQueryBuilder(UserMap, "user")
			.select("user.email")
			.where("user.email = :email", { email: email })
			.getRawOne();

		return new Promise<boolean>((resolve, _) => {
			userEmail != undefined && userEmail.user_email == email
				? resolve(true)
				: resolve(false);
		});
	}

	public async userTags(userId: UserId): Promise<UserTag[]> {
		const userTagMaps = await this.manager.find(UserTagMap, {
			where: { userId: userId.Id },
		});

		var userTags = userTagMaps.map((userTagMap) =>
			UserTagMap.userTag(userTagMap)
		);
		return userTags;
	}

	public async getById(id: UserId): Promise<User | undefined> {
		const userMap = await this.manager.findOne(UserMap, id.Id);
		return userMap != undefined ? UserMap.user(userMap) : undefined;
	}

	public async getByEmail(email: string): Promise<User | undefined> {
		const userMap = await this.manager.findOne(UserMap, {
			where: { email: email },
		});

		return userMap != undefined ? UserMap.user(userMap) : undefined;
	}

	public async save(user: User): Promise<string | number> {
		const userMap = UserMap.userMap(user);
		await this.manager.save(userMap);
		return userMap.id!;
	}

	public async update(user: User): Promise<string | number> {
		const userMap = UserMap.userMap(user);
		await this.manager.save(userMap);
		return userMap.id!;
	}

	public async delete(user: User): Promise<void>;
	public async delete(userId: UserId): Promise<void>;
	public async delete(param: User | UserId): Promise<void> {
		const id = UserId.ID in param ? param.id : (param as User).id?.Id;
		await this.manager.delete(UserMap, id);
	}

	public async saveUserTag(userTag: UserTag): Promise<string | number> {
		const userTagMap = UserTagMap.userTagMap(userTag);
		await this.manager.save(userTagMap);
		return userTagMap.id!;
	}

	public async saveUserTags(userTags: UserTag[]): Promise<void> {
		for (let i = 0; i < userTags.length; i++) {
			const userTag = userTags[i];
			const userTagMap = UserTagMap.userTagMap(userTag);
			await this.manager.save(userTagMap);
		}
	}

	public async deleteUserTags(userTags: UserTag[]): Promise<void> {
		for (let i = 0; i < userTags.length; i++) {
			const userTag = userTags[i];
			const userTagMap = UserTagMap.userTagMap(userTag);
			await this.manager.delete(UserTagMap, userTagMap.id);
		}
	}

	public async deleteUserTag(userTag: UserTag): Promise<void>;
	public async deleteUserTag(userTagId: UserTagId): Promise<void>;
	public async deleteUserTag(param: UserTag | UserTagId): Promise<void> {
		const id = UserTagId.ID in param ? param.id : (param as UserTag).id?.Id;
		await this.manager.delete(UserTagMap, id);
	}
}
