import { EntityRepository, EntityManager } from "typeorm";
import TagMap from "@src/persistence/sql/tags/tag.map";
import ITagRepository from "@src/application/tags/interfaces/tagRepository";
import Tag from "@src/domain/tags/tag";
import TagId from "@src/domain/tags/tagId";
import { injectable } from "inversify";

@EntityRepository()
@injectable()
export default class TagRepository implements ITagRepository {
	private readonly manager: EntityManager;
	constructor(manager: EntityManager) {
		this.manager = manager;
	}

	public async tagExistById(id: TagId): Promise<boolean> {
		const tagId = await this.manager
			.createQueryBuilder(TagMap, "tag")
			.select("tag.id")
			.where("tag.id = :id", { id: id.Id })
			.getRawOne();

		return new Promise<boolean>((resolve, _) => {
			tagId != undefined && tagId.tag_id === id.Id ? resolve(true) : resolve(false);
		});
	}

	public async tagExistByName(name: string): Promise<boolean> {
		const tagName = await this.manager
			.createQueryBuilder(TagMap, "tag")
			.select("tag.name")
			.where("LOWER(tag.name) = LOWER(:name)", { name: name })
			.getRawOne();

		return new Promise<boolean>((resolve, _) => {
			tagName != undefined &&
			tagName.tag_name.toLowerCase() === name.toLowerCase()
				? resolve(true)
				: resolve(false);
		});
	}

	public async getById(id: TagId): Promise<Tag | undefined> {
		const tagMap = await this.manager.findOne(TagMap, id.Id);

		return tagMap != undefined ? TagMap.tag(tagMap) : undefined;
	}

	public async getByName(name: string): Promise<Tag | undefined> {
		const tagMap = await this.manager.findOne(TagMap, {
			where: { name: name },
		});

		return tagMap != undefined ? TagMap.tag(tagMap) : undefined;
	}

	public async save(tag: Tag): Promise<string | number> {
		const tagMap = TagMap.tagMap(tag);
		await this.manager.save(tagMap);
		return tagMap.id!;
	}

	public async update(tag: Tag): Promise<string | number> {
		const tagMap = TagMap.tagMap(tag);
		await this.manager.save(tagMap);
		return tagMap.id!;
	}

	public async delete(tag: Tag): Promise<void>;
	public async delete(tagId: TagId): Promise<void>;
	public async delete(param: Tag | TagId): Promise<void> {
		const id = TagId.ID in param ? param.id : (param as Tag).id?.Id;
		await this.manager.delete(TagMap, id);
	}
}
