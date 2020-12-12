import { Container } from "inversify";
import {
	ConnectionOptions,
	createConnection,
	getConnectionManager,
} from "typeorm";
import { TYPES } from "../../application/common/types";
import IUserQuery from "../../application/users/interfaces/userQuery";
import IUserRepository from "../../application/users/interfaces/userRepository";
import IDatabase from "../common/database";
import UserQuery from "./users/userQuery";
import UserRepository from "./users/userRepository";

export default abstract class SqlDatabaseSetup implements IDatabase {
	protected ENTITIES: string = "src/persistence/sql/**/*.map{.ts, .js}";
	protected MIGRATIONS: string = "src/persistence/sql/migrations/*.ts";
	protected MIGRATIONSDIR: string = "src/persistence/sql/migrations";

	protected async migration(): Promise<void> {
		const dbConfig = this.configuration();
		const connection = await createConnection(dbConfig);
		await connection.runMigrations();
	}

	protected register(container: Container): void {
		container.bind<IUserRepository>(TYPES.IUserRepository)
			.toDynamicValue(() => {
				return new UserRepository(getConnectionManager().get().manager);
			})
			.inRequestScope();
		container.bind<IUserQuery>(TYPES.IUserQuery)
			.toDynamicValue(() => {
				return new UserQuery(getConnectionManager().get().manager);
			})
			.inRequestScope();
	}

	public abstract connect(container: Container): Promise<void>;
	public abstract configuration(): ConnectionOptions;
}
