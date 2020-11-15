import Request from "../../interfaces/request";
import RequestHandler from "../../interfaces/requesthandler";
import { validate, IsNotEmpty, IsString, IsEmail } from "class-validator";
import IUserRepository from "../interfaces/userRepository";
import User from "../../../domain/users/user";
import { injectable, inject } from "inversify";
import Result from "../../../domain/common/result";
import ActionResult from "../../../domain/common/actionresult";
import { TYPES } from "../../common/types";
import argon2 from "argon2"

export class CreateUserCommand implements Request<Promise<Result<string | number>>> {
    @IsNotEmpty()
    @IsString()
    public firstName: string | undefined;

    @IsNotEmpty()
    @IsString()
    public lastName: string | undefined;

    @IsNotEmpty()
    @IsString()
    public otherName: string | undefined;

    @IsEmail()
    public email: string | undefined;

    @IsNotEmpty()
    @IsString()
    public password: string | undefined;

    public static create(body: { firstName: string, lastName: string, otherName: string, email: string, password: string }): CreateUserCommand {
        var createUserCommand = new CreateUserCommand();
        createUserCommand.email = body.email;
        createUserCommand.firstName = body.firstName;
        createUserCommand.lastName = body.lastName;
        createUserCommand.otherName = body.otherName;
        createUserCommand.password = body.password;

        return createUserCommand;
    }
}

@injectable()
export class CreateUserCommandHandler implements RequestHandler<CreateUserCommand, Promise<Result<string | number>>> {
    private readonly _userrepository: IUserRepository;
    constructor(@inject(TYPES.IUserRepository) userRepository: IUserRepository) {
        this._userrepository = userRepository;
    }

    public async Handle(request: CreateUserCommand): Promise<Result<string | number>> {
        const validationResult = await validate(request);
        if (validationResult.length > 0) {
            return ActionResult.fail(validationResult.map(x => x.constraints));
        }

        const userExistByEmail = await this._userrepository.userExistByEmail(request.email!);
        if (userExistByEmail) {
            return ActionResult.fail(`A user with the email: '${request.email}' already exist!`);
        }

        const hashedPassword = await argon2.hash(request.password!);

        const user = User.create(request.firstName!, request.lastName!, request.otherName!, request.email!, hashedPassword);
        if (user.failure) {
            return ActionResult.fail(user.error);
        }

        const result = await this._userrepository.save(user.data);
        return ActionResult.ok(result);
    }
}