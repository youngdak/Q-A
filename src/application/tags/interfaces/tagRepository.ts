import Tag from "@src/domain/tags/tag";
import TagId from "@src/domain/tags/tagId";

export default interface ITagRepository {
	tagExistById(id: TagId): Promise<boolean>;
	tagExistByName(name: string): Promise<boolean>;
	getById(id: TagId): Promise<Tag | undefined>;
	getByName(name: string): Promise<Tag | undefined>;
	save(tag: Tag): Promise<string | number>;
	update(tag: Tag): Promise<string | number>;
	delete(tag: Tag): Promise<void>;
	delete(id: TagId): Promise<void>;
}
