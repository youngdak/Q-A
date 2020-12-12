import request, { SuperTest } from "supertest";
import { expect } from "chai";
import TestServer from "../configuration/testServer";
import User from "../../../src/domain/users/user";
import UserDto from "../../../src/application/users/queries/userDto";
import { RegisterCommand } from "../../../src/application/auth/commands/registerCommand";

var testServer = new TestServer();

describe("testing user api", () => {
	let api: SuperTest<request.Test>;
	before(async function () {
		api = await testServer.start();
	});

	it("should get logged-in user profile", async () => {
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

	it("should register user successfully", async () => {
		const registerCommand = new RegisterCommand();
		registerCommand.email = "${uuidv4()}_email@gmail.com";
		registerCommand.firstName = "Diepreye";
		registerCommand.lastName = "Micah";
		registerCommand.otherName = "Dakolo";
		registerCommand.password = "password";

		const userResponse = await api
			.get("/api/account/register")
			.send(registerCommand);

		expect(userResponse.body).to.not.be.null;
	});

	it("fail to login when user email does not exist", async () => {
		const cookie = await testServer.login("test@test.com", "password");
		expect(cookie).to.be.undefined;
	});

	after(() => {
		testServer.stop();
	});
});
