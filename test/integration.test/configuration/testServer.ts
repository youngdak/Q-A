import request, { SuperTest } from "supertest";
import Startup from "../../../src/startup";
import http from "http";
import { Container } from "inversify";
import User from "../../../src/domain/users/user";
import UserFake from "../user/userFake";
import IFake from "./fake";

export default class TestServer {
	private server: http.Server;
	private api: SuperTest<request.Test>;
	private _fakes: Map<string, any>;

	public async start(): Promise<SuperTest<request.Test>> {
		const startup = new Startup();
		this.server = await startup.start();
		this._fakes = this.initializeFake(startup.RunningContainer);
		this.api = request(this.server);
		return this.api;
	}

	public stop(): void {
		this.server.close();
		process.exit(0);
	}

	private initializeFake(container: Container): Map<string, any> {
		const fakes = new Map<string, any>([
			[User.EntityName, new UserFake(container)],
		]);

		return fakes;
	}

	public async fake<T>(name: string): Promise<T> {
		const ifake = this._fakes.get(name) as IFake<T>;
		const fake = await ifake.fake();
		return fake;
	}

	public async login(email: string, password: string): Promise<string[]> {
		if (!this.api) {
		}

		const login = {
			email,
			password,
			device: "test",
		};

		const response = await this.api.post("/api/account/login/").send(login);
		
		return response.headers["set-cookie"];
	}
}
