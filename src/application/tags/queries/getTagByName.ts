import Request from "@src/application/interfaces/request";
import RequestHandler from "@src/application/interfaces/requesthandler";
import { IsString, validate } from "class-validator";
import ITagQuery from "@src/application/tags/interfaces/tagQuery";
import { injectable, inject } from "inversify";
import Result from "@src/domain/common/result";
import ActionResult from "@src/domain/common/actionresult";
import { TYPES } from "@src/application/common/types";
import TagDto from "@src/application/tags/queries/tagDto";

export class GetTagByNameQuery implements Request<Promise<Result<TagDto>>> {
	@IsString()
	public name: string;

	public static create(param: { name: string }): GetTagByNameQuery {
		var getTagByName = new GetTagByNameQuery();
		getTagByName.name = param.name;

		return getTagByName;
	}
}

@injectable()
export class GetTagByNameQueryHandler
	implements RequestHandler<GetTagByNameQuery, Promise<Result<TagDto>>> {
	private readonly _tagQuery: ITagQuery;
	constructor(@inject(TYPES.ITagQuery) tagQuery: ITagQuery) {
		this._tagQuery = tagQuery;
	}

	public async handle(request: GetTagByNameQuery): Promise<Result<TagDto>> {
		const validationResult = await validate(request);
		if (validationResult.length > 0) {
			return ActionResult.fail(validationResult);
		}

		const result = await this._tagQuery.getByName(request.name!);
		return ActionResult.ok(result);
	}
}
