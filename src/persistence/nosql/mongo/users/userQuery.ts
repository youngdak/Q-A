import { injectable } from "inversify";
import IUserQuery from "../../../../application/users/interfaces/userQuery";
import UserDto from "../../../../application/users/queries/userDto";
import UserId from "../../../../domain/users/userId";
import { UserMap } from "./userDocument";

@injectable()
export default class UserQuery implements IUserQuery {
	private readonly userMap: UserMap;
	constructor(userMap: UserMap) {
		this.userMap = userMap;
	}

	public async getAll(): Promise<UserDto[]> {
		const userDocuments = await this.userMap.model.find();
		const users = userDocuments.map((userDocument) =>
			UserDto.userDto(UserMap.user(userDocument))
		);

		return users;
	}

	public async getById(id: UserId): Promise<UserDto> {
		const userDocument = await this.userMap.model.findOne({ _id: id.Id });
		return new Promise<UserDto>((resolve, reject) => {
			if (userDocument != undefined) {
				const user = UserMap.user(userDocument);
				const userDto = UserDto.userDto(user);
				resolve(userDto);
			} else {
				reject(`user with the id: ${id} not found!`);
			}
		});
	}

	public async getByEmail(email: string): Promise<UserDto> {
		const userDocument = await this.userMap.model.findOne({ email: email });
		return new Promise<UserDto>((resolve, reject) => {
			if (userDocument != undefined) {
				const user = UserMap.user(userDocument);
				const userDto = UserDto.userDto(user);
				resolve(userDto);
			} else {
				reject(`user with the email: ${email} not found!`);
			}
		});
	}
}
