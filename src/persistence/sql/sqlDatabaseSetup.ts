import { TYPES } from "@src/application/common/types";
import { Container } from "inversify";
import {
	ConnectionOptions,
	createConnection,
	getConnectionManager,
} from "typeorm";
import ITagQuery from "@src/application/tags/interfaces/tagQuery";
import ITagRepository from "@src/application/tags/interfaces/tagRepository";
import IUserQuery from "@src/application/users/interfaces/userQuery";
import IUserRepository from "@src/application/users/interfaces/userRepository";
import IDatabase from "@src/persistence/common/database";
import TagQuery from "@src/persistence/sql/tags/tagQuery";
import TagRepository from "@src/persistence/sql/tags/tagRepository";
import UserQuery from "@src/persistence/sql/users/userQuery";
import UserRepository from "@src/persistence/sql/users/userRepository";

export default abstract class SqlDatabaseSetup implements IDatabase {
	protected ENTITIES: string = "*/src/persistence/sql/**/*.map.*";
	protected MIGRATIONS: string = "*/src/persistence/sql/migrations/*.*";
	protected MIGRATIONSDIR: string = "*/src/persistence/sql/migrations";

	protected async migration(): Promise<void> {
		const dbConfig = this.configuration();
		const connection = await createConnection(dbConfig);
		await connection.runMigrations();
	}

	protected register(container: Container): void {
		container
			.bind<IUserRepository>(TYPES.IUserRepository)
			.toDynamicValue(() => {
				return new UserRepository(getConnectionManager().get().manager);
			})
			.inRequestScope();
		container
			.bind<IUserQuery>(TYPES.IUserQuery)
			.toDynamicValue(() => {
				return new UserQuery(getConnectionManager().get().manager);
			})
			.inRequestScope();
		container
			.bind<ITagRepository>(TYPES.ITagRepository)
			.toDynamicValue(() => {
				return new TagRepository(getConnectionManager().get().manager);
			})
			.inRequestScope();
		container
			.bind<ITagQuery>(TYPES.ITagQuery)
			.toDynamicValue(() => {
				return new TagQuery(getConnectionManager().get().manager);
			})
			.inRequestScope();
	}

	public abstract connect(container: Container): Promise<void>;
	public abstract configuration(): ConnectionOptions;
}
