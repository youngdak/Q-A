import Request from "@src/application/interfaces/request";
import RequestHandler from "@src/application/interfaces/requesthandler";
import { validate, IsNotEmpty, IsString } from "class-validator";
import IUserQuery from "@src/application/users/interfaces/userQuery";
import { injectable, inject } from "inversify";
import Result from "@src/domain/common/result";
import ActionResult from "@src/domain/common/actionresult";
import { TYPES } from "@src/application/common/types";
import UserId from "@src/domain/users/userId";
import UserDto from "@src/application/users/queries/userDto";

export class GetUserByIdQuery implements Request<Promise<Result<UserDto>>> {
	@IsNotEmpty()
	@IsString()
	public id: string | undefined;

	public static create(param: { id: string }): GetUserByIdQuery {
		var getUserById = new GetUserByIdQuery();
		getUserById.id = param.id;

		return getUserById;
	}
}

@injectable()
export class GetUserByIdQueryHandler
	implements RequestHandler<GetUserByIdQuery, Promise<Result<UserDto>>> {
	private readonly _userQuery: IUserQuery;
	constructor(@inject(TYPES.IUserQuery) userQuery: IUserQuery) {
		this._userQuery = userQuery;
	}

	public async handle(request: GetUserByIdQuery): Promise<Result<UserDto>> {
		const validationResult = await validate(request);
		if (validationResult.length > 0) {
			return ActionResult.fail(validationResult);
		}

		const userId = UserId.create(request.id!);

		const result = await this._userQuery.getById(userId);
		return ActionResult.ok(result);
	}
}
