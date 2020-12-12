import Request from "../../interfaces/request";
import RequestHandler from "../../interfaces/requesthandler";
import { validate, IsNotEmpty, IsString } from "class-validator";
import IUserQuery from "../interfaces/userQuery";
import { injectable, inject } from "inversify";
import Result from "../../../domain/common/result";
import ActionResult from "../../../domain/common/actionresult";
import { TYPES } from "../../common/types";
import UserId from "../../../domain/users/userId";
import UserDto from "./userDto";

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
