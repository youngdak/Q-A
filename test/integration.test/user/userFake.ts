import IUserRepository from "../../../src/application/users/interfaces/userRepository";
import User from "../../../src/domain/users/user";
import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
import { Container } from "inversify";
import { TYPES } from "../../../src/application/common/types";
import IFake from "../configuration/fake";

export default class UserFake implements IFake<User> {
	private readonly _userRepository: IUserRepository;

	constructor(container: Container) {
		this._userRepository = container.get(TYPES.IUserRepository);
	}

	public async fake(): Promise<User> {
		const hashedPassword = await argon2.hash("password");
		const unique = uuidv4();
		const user = User.create(
			"john",
			"doe",
			"milik",
			`${unique}@test.com`,
			hashedPassword
		);

		const result = await this._userRepository.save(user.data);

		return user.data;
	}
}
