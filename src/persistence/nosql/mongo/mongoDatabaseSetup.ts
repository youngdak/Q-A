import { Container } from "inversify";
import IUserQuery from "@src/application/users/interfaces/userQuery";
import IUserRepository from "@src/application/users/interfaces/userRepository";
import IDatabase from "@src/persistence/common/database";
import { UserMap } from "@src/persistence/nosql/mongo/users/userDocument";
import UserQuery from "@src/persistence/nosql/mongo/users/userQuery";
import UserRepository from "@src/persistence/nosql/mongo/users/userRepository";
import mongoose from "mongoose";
import { UserTagMap } from "@src/persistence/nosql/mongo/users/userTagDocument";
import ITagRepository from "@src/application/tags/interfaces/tagRepository";
import TagRepository from "@src/persistence/nosql/mongo/tags/tagRepository";
import ITagQuery from "@src/application/tags/interfaces/tagQuery";
import TagQuery from "@src/persistence/nosql/mongo/tags/tagQuery";
import { TagMap } from "@src/persistence/nosql/mongo/tags/tagDocument";
import EnvironmentVariable from "@src/environmentVariable";
import { TYPES } from "@src/application/common/types";

export default class MongoDatabaseSetup implements IDatabase {
	public async connect(container: Container): Promise<void> {
		await this.configuration();
		this.register(container);
	}

	private async configuration(): Promise<typeof mongoose> {
		// const conn_string = `mongodb://${EnvironmentVariable.DATABASE_USER}:${EnvironmentVariable.DATABASE_PASSWORD}@${EnvironmentVariable.DATABASE_HOST}:${EnvironmentVariable.DATABASE_PORT}/${EnvironmentVariable.DATABASE_NAME}?authSource=admin`;
		const conn_string = `mongodb://${EnvironmentVariable.DATABASE_HOST}:${EnvironmentVariable.DATABASE_PORT}/${EnvironmentVariable.DATABASE_NAME}`;
		const conn = await mongoose.connect(conn_string, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});

		return conn;
	}

	private register(container: Container): void {
		const userMap = new UserMap();
		const userTagMap = new UserTagMap();
		container
			.bind<IUserRepository>(TYPES.IUserRepository)
			.toDynamicValue(() => {
				return new UserRepository(userMap, userTagMap);
			})
			.inRequestScope();
		container
			.bind<IUserQuery>(TYPES.IUserQuery)
			.toDynamicValue(() => {
				return new UserQuery(userMap);
			})
			.inRequestScope();

		var tagMap = new TagMap();
		container
			.bind<ITagRepository>(TYPES.ITagRepository)
			.toDynamicValue(() => {
				return new TagRepository(tagMap);
			})
			.inRequestScope();
		container
			.bind<ITagQuery>(TYPES.ITagQuery)
			.toDynamicValue(() => {
				return new TagQuery(tagMap);
			})
			.inRequestScope();
	}
}

export { mongoose };
