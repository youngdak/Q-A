import Request from "@src/application/interfaces/request";
import RequestHandler from "@src/application/interfaces/requesthandler";
import IUserQuery from "@src/application/users/interfaces/userQuery";
import { injectable, inject } from "inversify";
import Result from "@src/domain/common/result";
import ActionResult from "@src/domain/common/actionresult";
import { TYPES } from "@src/application/common/types";
import UserDto from "@src/application/users/queries/userDto";

export class GetAllUsersQuery implements Request<Promise<Result<UserDto[]>>> {}

@injectable()
export class GetAllUsersQueryHandler
	implements RequestHandler<GetAllUsersQuery, Promise<Result<UserDto[]>>> {
	private readonly _userQuery: IUserQuery;
	constructor(@inject(TYPES.IUserQuery) userQuery: IUserQuery) {
		this._userQuery = userQuery;
	}

	async handle(_: GetAllUsersQuery): Promise<Result<UserDto[]>> {
		const result = await this._userQuery.getAll();
		return ActionResult.ok(result);
	}
}
