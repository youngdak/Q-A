import { ConnectionOptions } from "typeorm";
import * as dotenv from 'dotenv';

dotenv.config({ path: __dirname+'./../../.env' });

const sqliteConfig: ConnectionOptions = {
	type: "sqlite",
	database: process.env.SQL_DATABASE_DB!,
	entities: [__dirname + "src/persistence/sql/**/*.map{.ts,.js}"],
	migrations: [__dirname + "src/persistence/sql/migrations/**/*.ts"],
	cli: {
		migrationsDir: "src/persistence/sql",
	},
};

const postgresConfig: ConnectionOptions = {
	type: "postgres",
	host: process.env.SQL_DATABASE_HOST,
	port: Number(process.env.SQL_DATABASE_PORT),
	username: process.env.SQL_DATABASE_USER,
	password: process.env.SQL_DATABASE_PASSWORD,
	database: process.env.SQL_DATABASE_DB,
	entities: ["src/persistence/sql/**/*.map{.ts, .js}"], //[__dirname + "./**/*.map{.ts,.js}"],
	migrations: ["src/persistence/sql/migrations/*.ts"], //[__dirname + "./migrations/*.ts"],
	cli: {
		migrationsDir: "src/persistence/sql/migrations",
	},
};

const dbconfig = () : ConnectionOptions => {
	let config: ConnectionOptions = sqliteConfig;
	if (process.env.SQL_DATABASE_TYPE === "postgres") {
		config = postgresConfig;
	} else if (process.env.SQL_DATABASE_TYPE === "mysql") {
		config = postgresConfig;
    }
    
    return config;
}

export = dbconfig();
