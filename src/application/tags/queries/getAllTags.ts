import Request from "@src/application/interfaces/request";
import RequestHandler from "@src/application/interfaces/requesthandler";
import ITagQuery from "@src/application/tags/interfaces/tagQuery";
import { injectable, inject } from "inversify";
import Result from "@src/domain/common/result";
import ActionResult from "@src/domain/common/actionresult";
import { TYPES } from "@src/application/common/types";
import TagDto from "@src/application/tags/queries/tagDto";

export class GetAllTagsQuery implements Request<Promise<Result<TagDto[]>>> {}

@injectable()
export class GetAllTagsQueryHandler
	implements RequestHandler<GetAllTagsQuery, Promise<Result<TagDto[]>>> {
	private readonly _tagQuery: ITagQuery;
	constructor(@inject(TYPES.ITagQuery) tagQuery: ITagQuery) {
		this._tagQuery = tagQuery;
	}

	async handle(_: GetAllTagsQuery): Promise<Result<TagDto[]>> {
		const result = await this._tagQuery.getAll();
		return ActionResult.ok(result);
	}
}
