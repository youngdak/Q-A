import Request from "@src/application/interfaces/request";
import RequestHandler from "@src/application/interfaces/requesthandler";
import { validate, IsEmail } from "class-validator";
import IUserQuery from "@src/application/users/interfaces/userQuery";
import { injectable, inject } from "inversify";
import Result from "@src/domain/common/result";
import ActionResult from "@src/domain/common/actionresult";
import { TYPES } from "@src/application/common/types";
import UserDto from "@src/application/users/queries/userDto";

export class GetUserByEmailQuery implements Request<Promise<Result<UserDto>>> {
	@IsEmail()
	public email: string | undefined;

	public static create(param: { email: string }): GetUserByEmailQuery {
		var getUserByEmail = new GetUserByEmailQuery();
		getUserByEmail.email = param.email;

		return getUserByEmail;
	}
}

@injectable()
export class GetUserByEmailQueryHandler
	implements RequestHandler<GetUserByEmailQuery, Promise<Result<UserDto>>> {
	private readonly _userQuery: IUserQuery;
	constructor(@inject(TYPES.IUserQuery) userQuery: IUserQuery) {
		this._userQuery = userQuery;
	}

	public async handle(request: GetUserByEmailQuery): Promise<Result<UserDto>> {
		const validationResult = await validate(request);
		if (validationResult.length > 0) {
			return ActionResult.fail(validationResult);
		}

		const result = await this._userQuery.getByEmail(request.email!);
		return ActionResult.ok(result);
	}
}
