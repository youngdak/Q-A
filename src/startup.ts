import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import bodyParser from "body-parser";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import { buildSchema } from "type-graphql";
import UsersResolver from "@src/api/resolvers/users/usersResolver.v1";
import UserServiceLocator from "@src/application/users/userServiceLocator";
import IDatabase from "@src/persistence/common/database";
import PostgreSqlDatabaseSetup from "@src/persistence/sql/postgresqlDatabaseSetup";
import MongoDatabaseSetup from "@src/persistence/nosql/mongo/mongoDatabaseSetup";
import { ConnectionOptions } from "typeorm";
import SqlDatabaseSetup from "@src/persistence/sql/sqlDatabaseSetup";
import express from "express";
import { DatabaseType } from "@src/persistence/common/databaseType";
import http from "http";
import AuthMiddleware from "@src/application/auth/provider/authMiddleware";
import PassportMiddleware from "@src/application/auth/provider/passportMiddleware";
import AuthServiceLocator from "@src/application/auth/authServiceLocator";
import AccountResolver from "@src/api/resolvers/accountResolver";
import CustomContext from "@src/application/auth/provider/context";
import cookieParser from "cookie-parser";
import TagServiceLocator from "@src/application/tags/tagServiceLocator";
import TagsResolver from "@src/api/resolvers/tags/tagsResolver.v1";
import EnvironmentVariable from "@src/environmentVariable";
import { TYPES } from "@src/application/common/types";

export default class Startup {
	private readonly container: Container;
	private readonly sqlDatabaseSetup: SqlDatabaseSetup | undefined;
	private server: InversifyExpressServer;
	private apolloServer: ApolloServer;

	constructor() {
		this.container = new Container();
		this.sqlDatabaseSetup = this.registerSqlDatabase();
	}

	public get RunningContainer(): Container {
		return this.container;
	}

	public get ormconfig(): ConnectionOptions | undefined {
		return this.sqlDatabaseSetup
			? this.sqlDatabaseSetup!.configuration()
			: undefined;
	}

	public async start(): Promise<http.Server> {
		await this.registerServices();
		this.initializeServer();
		await this.initializeApolloServer();
		const app = this.application();

		const server = app.listen(EnvironmentVariable.PORT, () => {
			console.log(
				`Server running at http://localhost:${EnvironmentVariable.PORT}/`
			);
		});

		return server;
	}

	private async registerServices(): Promise<void> {
		await require("./api/controllers/users/usersController.v1");
		await require("./api/controllers/tags/tagsController.v1");
		await require("./api/controllers/accountController");

		this.container.bind<UsersResolver>(UsersResolver).toSelf();
		this.container.bind<TagsResolver>(TagsResolver).toSelf();
		this.container.bind<AccountResolver>(AccountResolver).toSelf();
		this.container
			.bind<UserServiceLocator>(TYPES.UserServiceLocator)
			.to(UserServiceLocator);
		this.container
			.bind<TagServiceLocator>(TYPES.TagServiceLocator)
			.to(TagServiceLocator);
		this.container
			.bind<AuthServiceLocator>(TYPES.AuthServiceLocator)
			.to(AuthServiceLocator);
		this.container.bind<AuthMiddleware>(AuthMiddleware).toSelf();

		await this.registerDatabase();
		const passportMiddleware = new PassportMiddleware(
			this.container.get(TYPES.IUserRepository)
		);
		this.container
			.bind(PassportMiddleware)
			.toDynamicValue(() => passportMiddleware);
	}

	private async registerDatabase(): Promise<void> {
		let database: IDatabase | undefined;

		if (this.sqlDatabaseSetup) {
			database = this.sqlDatabaseSetup as IDatabase;
		} else if (EnvironmentVariable.DATABASE_TYPE === DatabaseType.MONGO) {
			database = new MongoDatabaseSetup();
		}

		if (database) {
			await database.connect(this.container);
		} else {
			throw new Error(
				"Failed to initialize database. Make sure your environment variables is set to the supported databases"
			);
		}
	}

	private registerSqlDatabase(): SqlDatabaseSetup | undefined {
		let sqlDatabase: SqlDatabaseSetup | undefined;
		if (EnvironmentVariable.DATABASE_TYPE === DatabaseType.POSTGRES) {
			sqlDatabase = new PostgreSqlDatabaseSetup();
		}

		return sqlDatabase;
	}

	private initializeServer(): void {
		this.server = new InversifyExpressServer(
			this.container,
			null,
			{
				rootPath: "/api/",
			},
			null
		);
	}

	private async initializeApolloServer(): Promise<void> {
		const schema = await buildSchema({
			resolvers: ["./api/resolvers/**/*.ts"],
			container: this.container,
		});

		this.apolloServer = new ApolloServer({
			schema,
			context: ({ req, res }) => {
				const ctx: CustomContext = {
					req,
					res,
				};

				return ctx;
			},
		});
	}

	private application(): express.Application {
		this.server.setConfig((app) => {
			app.use(
				bodyParser.urlencoded({
					extended: true,
				})
			);
			app.use(bodyParser.json());
			app.use(cookieParser());
			this.apolloServer.applyMiddleware({ app });
		});

		return this.server.build();
	}
}
