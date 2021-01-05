import { injectable } from "inversify";
import ITagQuery from "@src/application/tags/interfaces/tagQuery";
import TagDto from "@src/application/tags/queries/tagDto";
import TagId from "@src/domain/tags/tagId";
import { TagMap } from "@src/persistence/nosql/mongo/tags/tagDocument";

@injectable()
export default class TagQuery implements ITagQuery {
	private readonly tagMap: TagMap;
	constructor(tagMap: TagMap) {
		this.tagMap = tagMap;
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
