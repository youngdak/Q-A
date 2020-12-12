import { Container } from "inversify";
import { ConnectionOptions } from "typeorm";
import EnvironmentVariable from "../../environmenVariable";
import SqlDatabaseSetup from "./sqlDatabaseSetup";

export default class PostgreSqlDatabaseSetup extends SqlDatabaseSetup {
	constructor() {
		super();
	}

	public configuration(): ConnectionOptions {
		const config: ConnectionOptions = {
			type: "postgres",
			host: EnvironmentVariable.DATABASE_HOST,
			port: Number(EnvironmentVariable.DATABASE_PORT),
			username: EnvironmentVariable.DATABASE_USER,
			password: EnvironmentVariable.DATABASE_PASSWORD,
			database: EnvironmentVariable.DATABASE_NAME,
			entities: [this.ENTITIES],
			migrations: [this.MIGRATIONS],
			cli: {
				migrationsDir: this.MIGRATIONSDIR,
			},
		};

		return config;
	}

	public async connect(container: Container): Promise<void> {
		await this.migration();
		this.register(container);
	}
}
