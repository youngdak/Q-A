import { injectable } from "inversify";
import IUserQuery from "@src/application/users/interfaces/userQuery";
import UserDto from "@src/application/users/queries/userDto";
import UserId from "@src/domain/users/userId";
import { UserMap } from "@src/persistence/nosql/mongo/users/userDocument";
import tagId from "@src/domain/tags/tagId";
import { TagMap } from "../tags/tagDocument";

@injectable()
export default class UserQuery implements IUserQuery {
	private readonly userMap: UserMap;
	private readonly tagMap: TagMap;
	constructor(userMap: UserMap, tagMap: TagMap) {
		this.userMap = userMap;
		this.tagMap = tagMap;
	}

	public async getUsersOfTag(id: tagId): Promise<UserDto[]> {
		const result = await this.tagMap.model.aggregate([
			{ $match: { _id: id.Id } },
			{ $lookup: { from: "usertags", localField: "_id", foreignField: "tagId", as: "usertags" } },
			{ $lookup: { from: "users", localField: "usertags.userId", foreignField: "_id", as: "users" } },
			{ $project: { _id: 0, users: 1 } }
		]);

		const userDocuments: any[] = result[0].users;

		const users = userDocuments.length > 0 ? userDocuments.map((userDocument) => {
			const user = UserMap.user(userDocument);
			return UserDto.userDto(user);
		}) : [];

		return users;
	}

	public async getAll(): Promise<UserDto[]> {
		const userDocuments = await this.userMap.model.find();
		const users = userDocuments.map((userDocument) =>
			UserDto.userDto(UserMap.user(userDocument))
		);

		return users;
	}

	public async getById(id: UserId): Promise<UserDto> {
		const userDocument = await this.userMap.model.findOne({ _id: id.Id });
		return new Promise<UserDto>((resolve, reject) => {
			if (userDocument != undefined) {
				const user = UserMap.user(userDocument);
				const userDto = UserDto.userDto(user);
				resolve(userDto);
			} else {
				reject(`user with the id: ${id} not found!`);
			}
		});
	}

	public async getByEmail(email: string): Promise<UserDto> {
		const userDocument = await this.userMap.model.findOne({ email: email });
		return new Promise<UserDto>((resolve, reject) => {
			if (userDocument != undefined) {
				const user = UserMap.user(userDocument);
				const userDto = UserDto.userDto(user);
				resolve(userDto);
			} else {
				reject(`user with the email: ${email} not found!`);
			}
		});
	}
}
