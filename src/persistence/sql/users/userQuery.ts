import { EntityRepository, EntityManager } from "typeorm";
import UserMap from "@src/persistence/sql/users/user.map";
import IUserQuery from "@src/application/users/interfaces/userQuery";
import UserId from "@src/domain/users/userId";
import { injectable } from "inversify";
import UserDto from "@src/application/users/queries/userDto";

@EntityRepository()
@injectable()
export default class UserQuery implements IUserQuery {
	private readonly manager: EntityManager;
	constructor(manager: EntityManager) {
		this.manager = manager;
	}

	public async getAll(): Promise<UserDto[]> {
		const userMaps = await this.manager.find(UserMap);
		const users = userMaps.map((userMap) =>
			UserDto.userDto(UserMap.user(userMap))
		);

		return users;
	}

	public async getById(id: UserId): Promise<UserDto> {
		const userMap = await this.manager.findOne(UserMap, id.Id);
		return new Promise<UserDto>((resolve, reject) => {
			if (userMap != undefined) {
				const user = UserMap.user(userMap);
				const userDto = UserDto.userDto(user);
				resolve(userDto);
			} else {
				reject(`user with the id: ${id} not found!`);
			}
		});
	}

	public async getByEmail(email: string): Promise<UserDto> {
		const userMap = await this.manager.findOne(UserMap, {
			where: { email: email },
		});
		return new Promise<UserDto>((resolve, reject) => {
			if (userMap != undefined) {
				const user = UserMap.user(userMap);
				const userDto = UserDto.userDto(user);
				resolve(userDto);
			} else {
				reject(`user with the email: ${email} not found!`);
			}
		});
	}
}
