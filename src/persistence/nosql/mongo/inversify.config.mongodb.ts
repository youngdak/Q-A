import { interfaces } from "inversify";
import { getMongoDbConnection } from "./mongo.db";
import { UserMap } from "./users/userDocument";
import IUserRepository from "../../../application/users/interfaces/userRepository";
import UserRepository from "./users/userRepository";
import { TYPES } from "../../../application/common/types";
import IUserQuery from "../../../application/users/interfaces/userQuery";
import UserQuery from "./users/userQuery";

export default async function mongodbBindings(bind: interfaces.Bind) {
	// Connect to Mongo database
	await getMongoDbConnection();

	const userMap = new UserMap();
	bind<IUserRepository>(TYPES.IUserRepository)
		.toDynamicValue(() => {
			return new UserRepository(userMap);
		})
		.inRequestScope();
	bind<IUserQuery>(TYPES.IUserQuery)
		.toDynamicValue(() => {
			return new UserQuery(userMap);
		})
		.inRequestScope();
}
