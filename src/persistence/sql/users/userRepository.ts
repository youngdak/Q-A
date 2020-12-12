import { EntityRepository, EntityManager } from "typeorm";
import UserMap from "./user.map";
import IUserRepository from "../../../application/users/interfaces/userRepository";
import User from "../../../domain/users/user";
import UserId from "../../../domain/users/userId";
import { injectable } from "inversify";

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

	public async getById(id: UserId): Promise<User | undefined> {
		const userMap = await this.manager.findOne(UserMap, id.Id, {
			relations: ["tokens"],
		});

		return userMap != undefined ? UserMap.user(userMap) : undefined;
	}

	public async getByEmail(email: string): Promise<User | undefined> {
		const userMap = await this.manager.findOne(UserMap, {
			where: { email: email },
			relations: ["tokens"],
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
}
