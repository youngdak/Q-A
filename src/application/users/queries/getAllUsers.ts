import Request from "../../interfaces/request";
import RequestHandler from "../../interfaces/requesthandler";
import IUserQuery from "../interfaces/userQuery";
import { injectable, inject } from "inversify";
import Result from "../../../domain/common/result";
import ActionResult from "../../../domain/common/actionresult";
import { TYPES } from "../../common/types";
import UserDto from "./userDto";

export class GetAllUsersQuery implements Request<Promise<Result<UserDto[]>>> { }

@injectable()
export class GetAllUsersQueryHandler implements RequestHandler<GetAllUsersQuery, Promise<Result<UserDto[]>>> {
    private readonly _userQuery: IUserQuery;
    constructor(@inject(TYPES.IUserQuery) userQuery: IUserQuery) {
        this._userQuery = userQuery;
    }

    async Handle(_: GetAllUsersQuery): Promise<Result<UserDto[]>> {
        const result = await this._userQuery.getAll();
        return ActionResult.ok(result);
    }
}