const DATABASE_TYPE = process.env.SQL_DATABASE_TYPE;
const DATABASE_HOST = process.env.SQL_DATABASE_HOST;
const DATABASE_USER = process.env.SQL_DATABASE_USER;
const DATABASE_PORT = Number(process.env.SQL_DATABASE_PORT);
const DATABASE_PASSWORD = process.env.SQL_DATABASE_PASSWORD;
const DATABASE_DB = process.env.SQL_DATABASE_DB;
const ENTITIES = __dirname + "src/persistence/sql/**/*.map.ts";
const MIGRATIONS = __dirname + "src/persistence/sql/migrations/**/*.ts";
const ENTITIESDIR = "src/persistence/sql";
const MIGRATIONSDIR = "src/persistence/sql/migrations";

console.log(ENTITIES);

module.exports = {
	DATABASE_TYPE,
	DATABASE_HOST,
	DATABASE_USER,
	DATABASE_PORT,
	DATABASE_PASSWORD,
	DATABASE_DB,
	ENTITIES,
	MIGRATIONS,
	ENTITIESDIR,
	MIGRATIONSDIR,
};
