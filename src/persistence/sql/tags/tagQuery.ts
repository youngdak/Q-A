import { EntityRepository, EntityManager } from "typeorm";
import ITagQuery from "@src/application/tags/interfaces/tagQuery";
import TagId from "@src/domain/tags/tagId";
import { injectable } from "inversify";
import TagDto from "@src/application/tags/queries/tagDto";
import TagMap from "@src/persistence/sql/tags/tag.map";

@EntityRepository()
@injectable()
export default class TagQuery implements ITagQuery {
	private readonly manager: EntityManager;
	constructor(manager: EntityManager) {
		this.manager = manager;
	}

	public async getAll(): Promise<TagDto[]> {
		const tagMaps = await this.manager.find(TagMap);
		const tags = tagMaps.map((tagMap) => TagDto.tagDto(TagMap.tag(tagMap)));

		return tags;
	}

	public async getById(id: TagId): Promise<TagDto> {
		const tagMap = await this.manager.findOne(TagMap, id.Id);
		return new Promise<TagDto>((resolve, reject) => {
			if (tagMap != undefined) {
				const tag = TagMap.tag(tagMap);
				const tagDto = TagDto.tagDto(tag);
				resolve(tagDto);
			} else {
				reject(`tag with the id: ${id.Id} not found!`);
			}
		});
	}

	public async getByName(name: string): Promise<TagDto> {
		const tagMap = await this.manager.findOne(TagMap, {
			where: { name: name },
		});
		return new Promise<TagDto>((resolve, reject) => {
			if (tagMap != undefined) {
				const tag = TagMap.tag(tagMap);
				const tagDto = TagDto.tagDto(tag);
				resolve(tagDto);
			} else {
				reject(`tag with the name: ${name} not found!`);
			}
		});
	}
}
