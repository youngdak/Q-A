import { injectable } from "inversify";
import ITagQuery from "@src/application/tags/interfaces/tagQuery";
import TagDto from "@src/application/tags/queries/tagDto";
import TagId from "@src/domain/tags/tagId";
import { TagMap } from "@src/persistence/nosql/mongo/tags/tagDocument";
import userId from "@src/domain/users/userId";
import { UserMap } from "../users/userDocument";

@injectable()
export default class TagQuery implements ITagQuery {
	private readonly tagMap: TagMap;
	private readonly userMap: UserMap;
	constructor(tagMap: TagMap, userMap: UserMap) {
		this.tagMap = tagMap;
		this.userMap = userMap;
	}
	public async getUserTags(id: userId): Promise<TagDto[]> {
		const result = await this.userMap.model.aggregate([
			{ $match: { _id: id.Id } },
			{ $lookup: { from: "usertags", localField: "_id", foreignField: "userId", as: "usertags" } },
			{ $lookup: { from: "tags", localField: "usertags.tagId", foreignField: "_id", as: "tags" } },
			{ $project: { _id: 0, tags: 1 } }
		]);

		const tagDocuments: any[] = result[0].tags;

		const tags = tagDocuments.length > 0 ? tagDocuments.map((tagDocument) => {
			const tag = TagMap.tag(tagDocument);
			return TagDto.tagDto(tag);
		}) : [];

		return tags;
	}

	public async getAll(): Promise<TagDto[]> {
		const tagDocuments = await this.tagMap.model.find();
		const tags = tagDocuments.map((tagDocument) =>
			TagDto.tagDto(TagMap.tag(tagDocument))
		);

		return tags;
	}

	public async getById(id: TagId): Promise<TagDto> {
		const tagDocument = await this.tagMap.model.findOne({ _id: id.Id });
		return new Promise<TagDto>((resolve, reject) => {
			if (tagDocument != undefined) {
				const tag = TagMap.tag(tagDocument);
				const tagDto = TagDto.tagDto(tag);
				resolve(tagDto);
			} else {
				reject(`tag with the id: ${id.Id} not found!`);
			}
		});
	}

	public async getByName(name: string): Promise<TagDto> {
		const tagDocument = await this.tagMap.model.findOne({ name: name });
		return new Promise<TagDto>((resolve, reject) => {
			if (tagDocument != undefined) {
				const tag = TagMap.tag(tagDocument);
				const tagDto = TagDto.tagDto(tag);
				resolve(tagDto);
			} else {
				reject(`tag with the name: ${name} not found!`);
			}
		});
	}
}
