import ITagRepository from "@src/application/tags/interfaces/tagRepository";
import { inject, injectable } from "inversify";
import { TYPES } from "@src/application/common/types";
import { GetAllTagsQueryHandler } from "@src/application/tags/queries/getAllTags";
import ITagQuery from "@src/application/tags/interfaces/tagQuery";
import { GetTagByIdQueryHandler } from "@src/application/tags/queries/getTagById";
import { UpdateTagCommandHandler } from "@src/application/tags/commands/updateTagCommand";
import { DeleteTagCommandHandler } from "@src/application/tags/commands/deleteTagCommand";
import { GetTagByNameQueryHandler } from "@src/application/tags/queries/getTagByName";
import { CreateTagCommandHandler } from "@src/application/tags/commands/createTagCommand";
import { GetUserTagsQueryHandler } from "@src/application/tags/queries/getUserTags";

@injectable()
export default class TagServiceLocator {
	private readonly _tagRepository: ITagRepository;
	private readonly _tagQuery: ITagQuery;
	constructor(
		@inject(TYPES.ITagRepository) tagRepository: ITagRepository,
		@inject(TYPES.ITagQuery) tagQuery: ITagQuery
	) {
		this._tagRepository = tagRepository;
		this._tagQuery = tagQuery;
	}

	public createTagCommandHanlder(): CreateTagCommandHandler {
		return new CreateTagCommandHandler(this._tagRepository);
	}

	public updateTagCommandHanlder(): UpdateTagCommandHandler {
		return new UpdateTagCommandHandler(this._tagRepository);
	}

	public deleteTagCommandHanlder(): DeleteTagCommandHandler {
		return new DeleteTagCommandHandler(this._tagRepository);
	}

	public getAllTagsQueryHanlder(): GetAllTagsQueryHandler {
		return new GetAllTagsQueryHandler(this._tagQuery);
	}

	public getTagByIdQueryHanlder(): GetTagByIdQueryHandler {
		return new GetTagByIdQueryHandler(this._tagQuery);
	}

	public getTagByNameQueryHanlder(): GetTagByNameQueryHandler {
		return new GetTagByNameQueryHandler(this._tagQuery);
	}

	public getUserTagQueryHanlder(): GetUserTagsQueryHandler {
		return new GetUserTagsQueryHandler(this._tagQuery);
	}
}
