import "module-alias/register";
import chai, { expect } from "chai";
import Tag from "@src/domain/tags/tag";
import { GuardMessage } from "@src/domain/common/guard";
import User from "@src/domain/users/user";
import UserTag from "@src/domain/users/userTag";
const should = chai.should();

describe("tag domain", () => {
	it("should create usertag successfully", () => {
		const user = User.create(
			"Diepreye",
			"Dakolo",
			"",
			"diepreye.dakolo@gmail.com",
			"good",
			"admin"
		).data;

		const tag = Tag.create("C#", "A very good programming language", "admin")
			.data;

		var userTag = UserTag.create(user.id?.Id!, tag.id?.Id!, "admin");

		userTag.success.should.be.true;
		userTag.data.userId.should.be.eq(user.id?.Id);
		userTag.data.tagId.should.be.eq(tag.id?.Id);
		userTag.data.createdBy.should.be.eq("admin");
		userTag.data.id!.should.not.be.null;
	});

	it("should fail to create usertag when userId is empty", () => {
		const tag = Tag.create("C#", "A very good programming language", "admin")
			.data;

		var userTag = UserTag.create("", tag.id?.Id!, "admin");
		userTag.failure.should.be.true;
		userTag.error.should.be.eq(
			GuardMessage.isNotNullEmptyOrWhitespace("user id")
		);
	});

	it("should fail to create usertag when tagId is empty", () => {
		const user = User.create(
			"Diepreye",
			"Dakolo",
			"",
			"diepreye.dakolo@gmail.com",
			"good",
			"admin"
		).data;

		var userTag = UserTag.create(user.id?.Id!, "", "admin");
		userTag.failure.should.be.true;
		userTag.error.should.be.eq(
			GuardMessage.isNotNullEmptyOrWhitespace("tag id")
		);
	});

	it("should fail to create usertag when createdby is empty", () => {
		const user = User.create(
			"Diepreye",
			"Dakolo",
			"",
			"diepreye.dakolo@gmail.com",
			"good",
			"admin"
		).data;

		const tag = Tag.create("C#", "A very good programming language", "admin")
			.data;

		var userTag = UserTag.create(user.id?.Id!, tag.id?.Id!, "  ");
		userTag.failure.should.be.true;
		userTag.error.should.be.eq(
			GuardMessage.isNotNullEmptyOrWhitespace("createdby")
		);
	});
});
