import "module-alias/register";
import chai, { expect } from "chai";
import Tag from "@src/domain/tags/tag";
import { GuardMessage } from "@src/domain/common/guard";
const should = chai.should();

describe("tag domain", () => {
	it("should create tag successfully", () => {
		const tag = Tag.create("C#", "A very good programming language", "admin");
		tag.success.should.be.true;
		tag.data.name.should.be.eq("C#");
		tag.data.description.should.be.eq("A very good programming language");
		tag.data.createdBy.should.be.eq("admin");
		tag.data.id!.should.not.be.null;
	});

	it("should fail to create tag when name is empty", () => {
		const tag = Tag.create("  ", "A very good programming language", "admin");
		tag.failure.should.be.true;
		tag.error.should.be.eq(GuardMessage.isNotNullEmptyOrWhitespace("name"));
	});

	it("should fail to create tag when description is empty", () => {
		const tag = Tag.create("C#", "", "admin");
		tag.failure.should.be.true;
		tag.error.should.be.eq(
			GuardMessage.isNotNullEmptyOrWhitespace("description")
		);
	});

	it("should fail to create tag when createdby is empty", () => {
		const tag = Tag.create("C#", "A very good programming language", " ");
		tag.failure.should.be.true;
		tag.error.should.be.eq(
			GuardMessage.isNotNullEmptyOrWhitespace("createdby")
		);
	});

	it("should update tag successfully", () => {
		const tag = Tag.create("C#", "A very good programming language", "admin")
			.data;

		const result = tag.update("python", "A very good language for machine learning");

		result.success.should.be.true;
		tag.name.should.be.eq("python");
		tag.description.should.be.eq("A very good language for machine learning");
		tag.id!.should.not.be.null;
	});

	it("should fail to update tag when name is empty", () => {
		const tag = Tag.create("C#", "A very good programming language", "admin")
			.data;

		const result = tag.update(" ", "A very good language for machine learning");

		result.failure.should.be.true;
		result.error.should.be.eq(GuardMessage.isNotNullEmptyOrWhitespace("name"));
	});

	it("should fail to update tag when description is empty", () => {
		const tag = Tag.create("C#", "A very good programming language", "admin")
			.data;

		const result = tag.update("python", "");
		result.failure.should.be.true;
		result.error.should.be.eq(
			GuardMessage.isNotNullEmptyOrWhitespace("description")
		);
	});
});
