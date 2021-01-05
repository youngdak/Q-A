import "module-alias/register";
import chai, { expect } from "chai";
import User from "@src/domain/users/user";
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
		user.data.id!.should.not.be.null;
	});

	it("should fail to create user when first name is empty", () => {
		const user = User.create(
			"",
			"Dakolo",
			"",
			"diepreye.dakolo@gmail.com",
			"good",
			"admin"
		);
		user.failure.should.be.true;
		user.error.should.be.eq("first name should not be null or empty");
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
		user.error.should.be.eq("last name should not be null or empty");
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
		user.error.should.be.eq("last name should not be null or empty");
	});

	it("should fail to create user when email is empty", () => {
		const user = User.create("Diepreye", "Dakolo", "", "", "good", "admin");
		user.failure.should.be.true;
		user.error.should.be.eq("email should not be null or empty");
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
		user.error.should.be.eq("password should not be null or empty");
	});

	// it("should add tags to user successfully", () => {
	// 	const userResult = User.create(
	// 		"Diepreye",
	// 		"Dakolo",
	// 		"",
	// 		"diepreye.dakolo@gmail.com",
	// 		"password",
	// 		"admin"
	// 	);
	// 	const user = userResult.data;

	// 	const tags: UserTag[] = [];
	// 	tags.push(
	// 		UserTag.create("c#", "very good programming language", "admin").data
	// 	);
	// 	tags.push(
	// 		UserTag.create("java", "very good programming language", "admin").data
	// 	);

	// 	user.manageTags(tags);
	// 	user.tags.length.should.be.eq(2);
	// });

	// it("should update some tags in user successfully", () => {
	// 	const userResult = User.create(
	// 		"Diepreye",
	// 		"Dakolo",
	// 		"",
	// 		"diepreye.dakolo@gmail.com",
	// 		"password",
	// 		"admin"
	// 	);
	// 	const user = userResult.data;

	// 	const tags: UserTag[] = [];
	// 	tags.push(UserTag.create("C#").data);
	// 	tags.push(UserTag.create("java").data);

	// 	user.manageTags(tags);

	// 	const addedTags = user.tags;
	// 	const javaTag = addedTags.find((x) => x.name == "java")!;
	// 	javaTag.update("python");

	// 	user.manageTags(addedTags);

	// 	user.tags.length.should.be.eq(2);
	// 	user.tags.find((x) => x.name == "java")?.should.be.undefined;
	// 	user.tags.find((x) => x.name == "python")?.should.not.be.undefined;
	// });

	// it("should remove some tags from user successfully", () => {
	// 	const userResult = User.create(
	// 		"Diepreye",
	// 		"Dakolo",
	// 		"",
	// 		"diepreye.dakolo@gmail.com",
	// 		"password",
	// 		"admin"
	// 	);
	// 	const user = userResult.data;

	// 	const tags: UserTag[] = [];
	// 	tags.push(UserTag.create("c#").data);
	// 	tags.push(UserTag.create("java").data);
	// 	tags.push(UserTag.create("go").data);
	// 	tags.push(UserTag.create("c++").data);
	// 	tags.push(UserTag.create("typescript").data);

	// 	user.manageTags(tags);

	// 	let addedTags = user.tags;
	// 	addedTags = addedTags.filter(
	// 		(x) => x.name !== "go" && x.name !== "typescript"
	// 	);

	// 	const javaTag = addedTags.find((x) => x.name == "java")!;
	// 	javaTag.update("python");

	// 	addedTags.push(UserTag.create("swift").data);
	// 	user.manageTags(addedTags);

	// 	user.tags.length.should.be.eq(4);
	// 	user.tags.find((x) => x.name == "java")?.should.be.undefined;
	// 	user.tags.find((x) => x.name == "python")?.should.not.be.undefined;
	// 	user.tags.find((x) => x.name == "swift")?.should.not.be.undefined;
	// 	user.tags.find((x) => x.name == "c++")?.should.not.be.undefined;
	// });
});
