import Request from "@src/application/interfaces/request";
import RequestHandler from "@src/application/interfaces/requesthandler";
import { validate, IsNotEmpty, IsString } from "class-validator";
import ITagQuery from "@src/application/tags/interfaces/tagQuery";
import { injectable, inject } from "inversify";
import Result from "@src/domain/common/result";
import ActionResult from "@src/domain/common/actionresult";
import { TYPES } from "@src/application/common/types";
import TagId from "@src/domain/tags/tagId";
import TagDto from "@src/application/tags/queries/tagDto";

export class GetTagByIdQuery implements Request<Promise<Result<TagDto>>> {
	@IsNotEmpty()
	@IsString()
	public id: string;

	public static create(param: { id: string }): GetTagByIdQuery {
		var getTagById = new GetTagByIdQuery();
		getTagById.id = param.id;

		return getTagById;
	}
}

@injectable()
export class GetTagByIdQueryHandler
	implements RequestHandler<GetTagByIdQuery, Promise<Result<TagDto>>> {
	private readonly _tagQuery: ITagQuery;
	constructor(@inject(TYPES.ITagQuery) tagQuery: ITagQuery) {
		this._tagQuery = tagQuery;
	}

	public async handle(request: GetTagByIdQuery): Promise<Result<TagDto>> {
		const validationResult = await validate(request);
		if (validationResult.length > 0) {
			return ActionResult.fail(validationResult);
		}

		const tagId = TagId.create(request.id!);

		const result = await this._tagQuery.getById(tagId);
		return ActionResult.ok(result);
	}
}
