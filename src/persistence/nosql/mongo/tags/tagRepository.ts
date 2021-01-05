import { injectable } from "inversify";
import ITagRepository from "@src/application/tags/interfaces/tagRepository";
import TagId from "@src/domain/tags/tagId";
import Tag from "@src/domain/tags/tag";
import { TagMap } from "@src/persistence/nosql/mongo/tags/tagDocument";

@injectable()
export default class TagRepository implements ITagRepository {
	private readonly tagMap: TagMap;
	constructor(tagMap: TagMap) {
		this.tagMap = tagMap;
	}

	public async tagExistById(id: TagId): Promise<boolean> {
		const tagById = await this.tagMap.model.findOne({ _id: id.Id });
		return new Promise<boolean>((resolve, _) => {
			tagById != null && tagById._id === id.Id ? resolve(true) : resolve(false);
		});
	}

	public async tagExistByName(name: string): Promise<boolean> {
		const tagByName = await this.tagMap.model.findOne({
			name: { $regex: name, $options: "i" },
		});

		return new Promise<boolean>((resolve, _) => {
			tagByName != null && tagByName.name.toLowerCase() === name.toLowerCase()
				? resolve(true)
				: resolve(false);
		});
	}

	public async getById(id: TagId): Promise<Tag | undefined> {
		const tagDocument = await this.tagMap.model.findOne({ _id: id.Id });
		return tagDocument != undefined ? TagMap.tag(tagDocument) : undefined;
	}

	public async getByName(name: string): Promise<Tag | undefined> {
		const tagDocument = await this.tagMap.model.findOne({
			name: { $regex: name, $options: "i" },
		});

		return tagDocument != undefined ? TagMap.tag(tagDocument) : undefined;
	}

	public async save(tag: Tag): Promise<string | number> {
		const tagDocument = TagMap.tagDocument(tag);
		await this.tagMap.model.create(tagDocument);
		return tag.id?.Id!;
	}

	public async update(tag: Tag): Promise<string | number> {
		const tagDocument = TagMap.tagDocument(tag);
		await this.tagMap.model.updateOne({ _id: tag.id?.Id }, tagDocument);
		return tag.id?.Id!;
	}

	public async delete(tag: Tag): Promise<void>;
	public async delete(tagId: TagId): Promise<void>;
	public async delete(param: Tag | TagId): Promise<void> {
		const id = TagId.ID in param ? param.id : (param as Tag).id?.Id;
		await this.tagMap.model.deleteOne({ _id: id });
	}
}
