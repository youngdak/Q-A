import "module-alias/register";
import chai, { expect } from "chai";
import User from "@src/domain/users/user";
import { GuardMessage } from "@src/domain/common/guard";
const should = chai.should();

describe("user domain", () => {
	it("should create user successfully", () => {
		const user = User.create(
			"Diepreye",
			"Dakolo",
			"",
			"diepreye.dakolo@gmail.com",
			"good",
			"admin"
		);
		user.success.should.be.true;
		user.data.firstName.should.be.eq("Diepreye");
		user.data.lastName.should.be.eq("Dakolo");
		user.data.email.should.be.eq("diepreye.dakolo@gmail.com");
		user.data.createdBy.should.be.eq("admin");
		user.data.id!.should.not.be.null;
	});

	it("should fail to create user when first name is empty", () => {
		const user = User.create(
			"  ",
			"Dakolo",
			"",
			"diepreye.dakolo@gmail.com",
			"good",
			"admin"
		);
		user.failure.should.be.true;
		user.error.should.be.eq(
			GuardMessage.isNotNullEmptyOrWhitespace("first name")
		);
	});

	it("should fail to create user when last name is empty", () => {
		const user = User.create(
			"Diepreye",
			"",
			"",
			"diepreye.dakolo@gmail.com",
			"good",
			"admin"
		);
		user.failure.should.be.true;
		user.error.should.be.eq(
			GuardMessage.isNotNullEmptyOrWhitespace("last name")
		);
	});

	it("should fail to create user when email is empty", () => {
		const user = User.create("Diepreye", "Dakolo", "", "", "good", "admin");
		user.failure.should.be.true;
		user.error.should.be.eq(GuardMessage.isNotNullEmptyOrWhitespace("email"));
	});

	it("should fail to create user when password is empty", () => {
		const user = User.create(
			"Diepreye",
			"Dakolo",
			"",
			"diepreye.dakolo@gmail.com",
			"",
			"admin"
		);
		user.failure.should.be.true;
		user.error.should.be.eq(GuardMessage.isNotNullOrEmpty("password"));
	});

	it("should fail to create user when createdby is empty", () => {
		const user = User.create(
			"Diepreye",
			"Dakolo",
			"",
			"diepreye.dakolo@gmail.com",
			"good",
			" "
		);
		user.failure.should.be.true;
		user.error.should.be.eq(
			GuardMessage.isNotNullEmptyOrWhitespace("createdby")
		);
	});

	it("should update user successfully", () => {
		const user = User.create(
			"Diepreye",
			"Dakolo",
			"",
			"diepreye.dakolo@gmail.com",
			"good",
			"admin"
		).data;

		const result = user.update("Joseph", "Ameh", "Ojonugwa");

		result.success.should.be.true;
		user.firstName.should.be.eq("Joseph");
		user.lastName.should.be.eq("Ameh");
		user.otherName!.should.be.eq("Ojonugwa");
		user.id!.should.not.be.null;
	});

	it("should fail to update user when first name is empty", () => {
		const user = User.create(
			"Diepreye",
			"Dakolo",
			"",
			"diepreye.dakolo@gmail.com",
			"good",
			"admin"
		).data;

		const result = user.update(" ", "Ameh", "Ojonugwa");

		result.failure.should.be.true;
		result.error.should.be.eq(GuardMessage.isNotNullEmptyOrWhitespace("first name"));
	});

	it("should fail to update user when last name is empty", () => {
		const user = User.create(
			"Diepreye",
			"Dakolo",
			"",
			"diepreye.dakolo@gmail.com",
			"good",
			"admin"
		).data;

		const result = user.update("Joseph", "", "Ojonugwa");
		result.failure.should.be.true;
		result.error.should.be.eq(
			GuardMessage.isNotNullEmptyOrWhitespace("last name")
		);
	});
});
