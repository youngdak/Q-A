import { AsyncContainerModule } from "inversify";
import UserServiceLocator from "./application/users/userServiceLocator";
import { TYPES } from "./application/common/types";
import sqlBindings from "./persistence/sql/inversify.config.sql";
import nosqlBindings from "./persistence/nosql/inversify.config.nosql";

export const bindings = new AsyncContainerModule(async (bind) => {
	await require("./api/controllers/users/usersController.v1");

	bind<UserServiceLocator>(TYPES.UserServiceLocator).to(UserServiceLocator);

	// bind to nosql
	await sqlBindings(bind);

	// bind to nosql
	// await nosqlBindings(bind);
});
