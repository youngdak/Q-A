import { Container } from "inversify";
import { TYPES } from "../../../application/common/types";
import IUserQuery from "../../../application/users/interfaces/userQuery";
import IUserRepository from "../../../application/users/interfaces/userRepository";
import IDatabase from "../../common/database";
import { UserMap } from "./users/userDocument";
import UserQuery from "./users/userQuery";
import UserRepository from "./users/userRepository";
import mongoose from "mongoose";
import EnvironmentVariable from "../../../environmenVariable";

export default class MongoDatabaseSetup implements IDatabase {
	public async connect(container: Container): Promise<void> {
		await this.configuration();
		this.register(container);
	}

	private async configuration(): Promise<typeof mongoose> {
		const conn = await mongoose.connect(
			`mongodb://${EnvironmentVariable.DATABASE_HOST}:${EnvironmentVariable.DATABASE_PORT}/${EnvironmentVariable.DATABASE_NAME}`,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useCreateIndex: true,
			}
		);

		return conn;
	}

	private register(container: Container): void {
		const userMap = new UserMap();
		container
			.bind<IUserRepository>(TYPES.IUserRepository)
			.toDynamicValue(() => {
				return new UserRepository(userMap);
			})
			.inRequestScope();
		container
			.bind<IUserQuery>(TYPES.IUserQuery)
			.toDynamicValue(() => {
				return new UserQuery(userMap);
			})
			.inRequestScope();
	}
}

export { mongoose };
