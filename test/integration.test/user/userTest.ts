import request, { SuperTest } from "supertest";
import { expect } from "chai";
import TestServer from "@test/integration.test/configuration/testServer";
import User from "@src/domain/users/user";
import UserDto from "@src/application/users/queries/userDto";
import { RegisterCommand } from "@src/application/auth/commands/registerCommand";
import { v4 as uuidv4 } from "uuid";

var testServer = new TestServer();

describe("testing user api", () => {
	let api: SuperTest<request.Test>;
	before(async function () {
		api = await testServer.start();
	});

	it("should register user successfully", async () => {
		const registerCommand = new RegisterCommand();
		registerCommand.email = `${uuidv4()}_email@gmail.com`;
		registerCommand.firstName = "Diepreye";
		registerCommand.lastName = "Micah";
		registerCommand.otherName = "Dakolo";
		registerCommand.password = "password";

		const userResponse = await api
			.post("/api/account/register")
			.send(registerCommand);

		expect(userResponse.status).to.be.eq(200);
		expect(userResponse.body).to.not.be.empty;
	});

	it("should fail to register user when first name is null or empty or whitespace", async () => {
		const firstNames = [null, undefined, "", " "];

		for (let firstName in firstNames) {
			const registerCommand = {
				email: `${uuidv4()}_email@gmail.com`,
				firstName: firstNames[firstName],
				lastName: "Micah",
				otherName: "Dakolo",
				password: "password",
			}

			const userResponse = await api
				.post("/api/account/register")
				.send(registerCommand);

			expect((userResponse.error as { text: string }).text).to.not.be.undefined;
			expect(userResponse.status).to.be.eq(400);
			expect(userResponse.body).to.be.empty;
		}
	});

	it("should fail to register user when last name is null or empty or whitespace", async () => {
		const lastNames = [null, undefined, "", " "];

		for (let lastName in lastNames) {
			const registerCommand = {
				email: `${uuidv4()}_email@gmail.com`,
				firstName: "Micah",
				lastName: lastNames[lastName],
				otherName: "Dakolo",
				password: "password",
			}

			const userResponse = await api
				.post("/api/account/register")
				.send(registerCommand);

			expect((userResponse.error as { text: string }).text).to.not.be.undefined;
			expect(userResponse.status).to.be.eq(400);
			expect(userResponse.body).to.be.empty;
		}
	});

	it("should fail to register user when email not valid", async () => {
		const emails = [null, undefined, "", " ", "abc@gmail"];

		for (let email in emails) {
			const registerCommand = {
				email: emails[email],
				firstName: "Diepreye",
				lastName: "Micah",
				otherName: "Dakolo",
				password: "password",
			}

			const userResponse = await api
				.post("/api/account/register")
				.send(registerCommand);

			expect((userResponse.error as { text: string }).text).to.not.be.undefined;
			expect(userResponse.status).to.be.eq(400);
			expect(userResponse.body).to.be.empty;
		}
	});

	it("should fail to register user when password is null or empty", async () => {
		const passwords = [null, undefined, ""];

		for (let password in passwords) {
			const registerCommand = {
				email: `${uuidv4()}_email@gmail.com`,
				firstName: "Diepreye",
				lastName: "Micah",
				otherName: "Dakolo",
				password: passwords[password],
			}

			const userResponse = await api
				.post("/api/account/register")
				.send(registerCommand);

			expect((userResponse.error as { text: string }).text).to.not.be.undefined;
			expect(userResponse.status).to.be.eq(400);
			expect(userResponse.body).to.be.empty;
		}
	});

	it("should login successfully", async () => {
		const user = await testServer.fake<User>(User.EntityName);
		const cookie = await testServer.login(user.email, "password");

		expect(cookie).to.not.be.undefined;
	});

	it("should fail to login when user email does not exist", async () => {
		const cookie = await testServer.login("test@test.com", "password");

		expect(cookie).to.be.undefined;
	});

	it("should retrieve user profile successfully", async () => {
		const user = await testServer.fake<User>(User.EntityName);
		const cookie = await testServer.login(user.email, "password");

		const userResponse = await api
			.get("/api/users/profile")
			.set("Cookie", cookie);
		const userProfile = userResponse.body as UserDto;

		expect(userResponse.status).to.be.eq(200);
		expect(userProfile).to.not.be.null;
		expect(userProfile.id).to.be.eq(user.id?.Id);
		expect(userProfile.email).to.be.eq(user.email);
		expect(userProfile.firstName).to.be.eq(user.firstName);
		expect(userProfile.lastName).to.be.eq(user.lastName);
		expect(userProfile.otherName).to.be.eq(user.otherName);
	});

	it("should retrieve user by id successfully", async () => {
		const user = await testServer.fake<User>(User.EntityName);
		const cookie = await testServer.login(user.email, "password");

		const userResponse = await api
			.get(`/api/users/${user.id?.Id}`)
			.set("Cookie", cookie);
		const userById = userResponse.body as UserDto;

		expect(userResponse.status).to.be.eq(200);
		expect(userById).to.not.be.null;
		expect(userById.id).to.be.eq(user.id?.Id);
		expect(userById.email).to.be.eq(user.email);
		expect(userById.firstName).to.be.eq(user.firstName);
		expect(userById.lastName).to.be.eq(user.lastName);
		expect(userById.otherName).to.be.eq(user.otherName);
	});

	after(() => {
		testServer.stop();
	});
});
