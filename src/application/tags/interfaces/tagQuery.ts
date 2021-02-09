import TagId from "@src/domain/tags/tagId";
import TagDto from "@src/application/tags/queries/tagDto";
import UserId from "@src/domain/users/userId";

export default interface ITagQuery {
	getAll(): Promise<TagDto[]>;
	getById(id: TagId): Promise<TagDto>;
	getByName(name: string): Promise<TagDto>;
	getUserTags(id: UserId): Promise<TagDto[]>;
}
