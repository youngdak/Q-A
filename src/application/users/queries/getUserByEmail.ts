import Request from "../../interfaces/request";
import RequestHandler from "../../interfaces/requesthandler";
import { validate, IsEmail } from "class-validator";
import IUserQuery from "../interfaces/userQuery";
import { injectable, inject } from "inversify";
import Result from "../../../domain/common/result";
import ActionResult from "../../../domain/common/actionresult";
import { TYPES } from "../../common/types";
import UserDto from "./userDto";

export class GetUserByEmailQuery implements Request<Promise<Result<UserDto>>> {
    @IsEmail()
    public email: string | undefined;

    public static create(param: { email: string }) : GetUserByEmailQuery {
        var getUserByEmail = new GetUserByEmailQuery();
        getUserByEmail.email = param.email;

        return getUserByEmail;
    }
}

@injectable()
export class GetUserByEmailQueryHandler implements RequestHandler<GetUserByEmailQuery, Promise<Result<UserDto>>> {
    private readonly _userQuery: IUserQuery;
    constructor(@inject(TYPES.IUserQuery) userQuery: IUserQuery) {
        this._userQuery = userQuery;
    }

    public async Handle(request: GetUserByEmailQuery): Promise<Result<UserDto>> {
        const validationResult = await validate(request);
        if (validationResult.length > 0) {
            return ActionResult.fail(validationResult);
        }
        
        const result = await this._userQuery.getByEmail(request.email!);
        return ActionResult.ok(result);
    }
}