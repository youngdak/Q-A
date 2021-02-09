import Request from "@src/application/interfaces/request";
import RequestHandler from "@src/application/interfaces/requesthandler";
import IUserQuery from "@src/application/users/interfaces/userQuery";
import { injectable, inject } from "inversify";
import Result from "@src/domain/common/result";
import ActionResult from "@src/domain/common/actionresult";
import { TYPES } from "@src/application/common/types";
import UserDto from "@src/application/users/queries/userDto";
import { IsNotEmpty, IsString, validate } from "class-validator";
import TagId from "@src/domain/tags/tagId";

export class GetUsersOfTagQuery implements Request<Promise<Result<UserDto[]>>> {
	@IsNotEmpty()
	@IsString()
	public id: string;

	public static create(param: { id: string }): GetUsersOfTagQuery {
		var getUserById = new GetUsersOfTagQuery();
		getUserById.id = param.id;

		return getUserById;
	}
}

@injectable()
export class GetUsersOfTagQueryHandler
	implements RequestHandler<GetUsersOfTagQuery, Promise<Result<UserDto[]>>> {
	private readonly _userQuery: IUserQuery;
	constructor(@inject(TYPES.IUserQuery) userQuery: IUserQuery) {
		this._userQuery = userQuery;
	}

	async handle(request: GetUsersOfTagQuery): Promise<Result<UserDto[]>> {
		const validationResult = await validate(request);
		if (validationResult.length > 0) {
			return ActionResult.fail(validationResult);
		}

		const tagId = TagId.create(request.id!);

		const result = await this._userQuery.getUsersOfTag(tagId);
		return ActionResult.ok(result);
	}
}
