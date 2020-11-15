import { CreateUserCommand } from "../../../application/users/commands/createUserCommand";
import { Request, RequestHandler, Response } from "express";
import { inject } from "inversify";
import {
	controller,
	httpPost,
	request,
	response,
	httpGet,
	httpPatch,
	httpDelete,
} from "inversify-express-utils";
import { TYPES } from "../../../application/common/types";
import UserServiceLocator from "../../../application/users/userServiceLocator";
import BaseController from "../baseController";
import { GetUserByIdQuery } from "../../../application/users/queries/getUserById";
import { UpdateUserCommand } from "../../../application/users/commands/updateUserCommand";
import { DeleteUserCommand } from "../../../application/users/commands/deleteUserCommand";
import { GetUserByEmailQuery } from "../../../application/users/queries/getUserByEmail";
import { GetAllUsersQuery } from "../../../application/users/queries/getAllUsers";

@controller("/users")
export default class UsersController extends BaseController {
	private readonly _userServiceLocator: UserServiceLocator;
	constructor(
		@inject(TYPES.UserServiceLocator) userServiceLocator: UserServiceLocator
	) {
		super();
		this._userServiceLocator = userServiceLocator;
	}

	@httpGet("/")
	public async getAllUsers(@response() res: Response): Promise<Response<any>> {
		const result = await this._userServiceLocator.getAllUsersQueryHanlder().Handle(new GetAllUsersQuery());
		return this.result(res, result);
	}

	@httpGet("/profile")
	public async get(@response() res: Response): Promise<Response<any>> {
		const userEmail = this.httpContext.user.details as { email: string };
		const getUserByEmailQuery = GetUserByEmailQuery.create(userEmail);
		const result = await this._userServiceLocator
			.getUserByEmailQueryHanlder()
			.Handle(getUserByEmailQuery);
		return this.result(res, result);
	}

	@httpGet("/:id")
	public async getById(@request() req: Request, @response() res: Response) {
		const getUserByIdQuery = GetUserByIdQuery.create(
			req.params as { id: string }
		);
		const result = await this._userServiceLocator
			.getUserByIdQueryHanlder()
			.Handle(getUserByIdQuery);
		return this.result(res, result);
	}

	@httpPost("/")
	public async post(@request() req: Request, @response() res: Response) {
		const createUserCommand = CreateUserCommand.create(req.body);
		const result = await this._userServiceLocator
			.createUserCommandHanlder()
			.Handle(createUserCommand);
		return this.result(res, result);
	}

	@httpPatch("/:id")
	public async patch(@request() req: Request, @response() res: Response) {
		const updateUserCommand = UpdateUserCommand.create(req.params.id, req.body);
		const result = await this._userServiceLocator
			.updateUserCommandHanlder()
			.Handle(updateUserCommand);
		return this.result(res, result);
	}

	@httpDelete("/:id")
	public async delete(@request() req: Request, @response() res: Response) {
		const deleteUserCommand = DeleteUserCommand.create({ id: req.params.id });
		const result = await this._userServiceLocator
			.deleteUserCommandHanlder()
			.Handle(deleteUserCommand);
		return this.result(res, result);
	}
}
