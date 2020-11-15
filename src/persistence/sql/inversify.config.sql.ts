import { interfaces } from "inversify";
import { createConnection, getConnectionManager } from "typeorm";
import { TYPES } from "../../application/common/types";
import IUserRepository from "../../application/users/interfaces/userRepository";
import UserRepository from "./users/userRepository";
import IUserQuery from "../../application/users/interfaces/userQuery";
import UserQuery from "./users/userQuery";
import { getPostgreSqlDbConnection } from "./postgresql.db";
import { getMySqlDbConnection } from "./mysql.db";
import dbconfig from "./ormconfig";

export default async function sqlBindings(bind: interfaces.Bind) {
	// Connect to PostgreSql database
	// if (DATABASE_TYPE === "postgres") {
	// 	await getPostgreSqlDbConnection();
	// } else if (DATABASE_TYPE === "mysql") {
	// 	await getMySqlDbConnection();
	// }

	try {
		const connection = await createConnection(dbconfig);
		await connection.runMigrations();
	  } catch (error) {
		console.log('Error while connecting to the database', error);
		return error;
	  }

	bind<IUserRepository>(TYPES.IUserRepository)
		.toDynamicValue(() => {
			return new UserRepository(getConnectionManager().get().manager);
		})
		.inRequestScope();
	bind<IUserQuery>(TYPES.IUserQuery)
		.toDynamicValue(() => {
			return new UserQuery(getConnectionManager().get().manager);
		})
		.inRequestScope();
}
