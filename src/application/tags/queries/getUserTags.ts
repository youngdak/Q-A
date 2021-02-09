import Request from "@src/application/interfaces/request";
import RequestHandler from "@src/application/interfaces/requesthandler";
import ITagQuery from "@src/application/tags/interfaces/tagQuery";
import { injectable, inject } from "inversify";
import Result from "@src/domain/common/result";
import ActionResult from "@src/domain/common/actionresult";
import { TYPES } from "@src/application/common/types";
import TagDto from "@src/application/tags/queries/tagDto";
import { IsNotEmpty, IsString } from "class-validator";
import UserId from "@src/domain/users/userId";

export class GetUserTagsQuery implements Request<Promise<Result<TagDto[]>>> {
	@IsNotEmpty()
	@IsString()
	public id: string;

	public static create(param: { id: string }): GetUserTagsQuery {
		var getUserTags = new GetUserTagsQuery();
		getUserTags.id = param.id;

		return getUserTags;
	}
}

@injectable()
export class GetUserTagsQueryHandler
	implements RequestHandler<GetUserTagsQuery, Promise<Result<TagDto[]>>> {
	private readonly _tagQuery: ITagQuery;
	constructor(@inject(TYPES.ITagQuery) tagQuery: ITagQuery) {
		this._tagQuery = tagQuery;
	}

	async handle(request: GetUserTagsQuery): Promise<Result<TagDto[]>> {
		const userId = UserId.create(request.id!);
		const result = await this._tagQuery.getUserTags(userId);
		return ActionResult.ok(result);
	}
}
