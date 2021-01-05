import { Request } from "express";
import { inject } from "inversify";
import {
	controller,
	request,
	httpGet,
	httpPatch,
	interfaces,
	httpPost,
} from "inversify-express-utils";
import { TYPES } from "@src/application/common/types";
import UserServiceLocator from "@src/application/users/userServiceLocator";
import BaseController from "@src/api/common/baseController";
import { GetUserByIdQuery } from "@src/application/users/queries/getUserById";
import { UpdateUserCommand } from "@src/application/users/commands/updateUserCommand";
import AuthMiddleware from "@src/application/auth/provider/authMiddleware";
import UserDto from "@src/application/users/queries/userDto";
import { AssignTagsToUserCommand } from "@src/application/users/commands/assignTagsToUserCommand";

@controller("/users")
export default class UsersController extends BaseController {
	private readonly _userServiceLocator: UserServiceLocator;
	constructor(
		@inject(TYPES.UserServiceLocator) userServiceLocator: UserServiceLocator
	) {
		super();
		this._userServiceLocator = userServiceLocator;
	}

	@httpGet("/profile", AuthMiddleware)
	public async profile(
		@request() req: Request
	): Promise<interfaces.IHttpActionResult> {
		const user = UserDto.userDtoFromExpress(req.user!);
		return this.result(user);
	}

	@httpGet("/:id", AuthMiddleware)
	public async getById(
		@request() req: Request
	): Promise<interfaces.IHttpActionResult> {
		const getUserByIdQuery = GetUserByIdQuery.create(
			req.params as { id: string }
		);
		const result = await this._userServiceLocator
			.getUserByIdQueryHanlder()
			.handle(getUserByIdQuery);

		return this.result(result);
	}

	@httpPatch("/:id", AuthMiddleware)
	public async update(
		@request() req: Request
	): Promise<interfaces.IHttpActionResult> {
		const updateUserCommand = UpdateUserCommand.create(req.params.id, req.body);
		const result = await this._userServiceLocator
			.updateUserCommandHanlder()
			.handle(updateUserCommand);

		return this.result(result);
	}

	@httpPost("/tagUser", AuthMiddleware)
	public async assignTagsToUser(
		@request() req: Request
	): Promise<interfaces.IHttpActionResult> {
		const assignTagsToUserCommand = AssignTagsToUserCommand.create(req.body);
		const result = await this._userServiceLocator
			.assignTagsToUserCommandHanlder()
			.handle(assignTagsToUserCommand);

		return this.result(result);
	}
}
