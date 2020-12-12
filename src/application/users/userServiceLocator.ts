import IUserRepository from "./interfaces/userRepository";
import { inject, injectable } from "inversify";
import { TYPES } from "../common/types";
import { GetAllUsersQueryHandler } from "./queries/getAllUsers";
import IUserQuery from "./interfaces/userQuery";
import { GetUserByIdQueryHandler } from "./queries/getUserById";
import { UpdateUserCommandHandler } from "./commands/updateUserCommand";
import { DeleteUserCommandHandler } from "./commands/deleteUserCommand";
import { GetUserByEmailQueryHandler } from "./queries/getUserByEmail";

@injectable()
export default class UserServiceLocator {
	private readonly _userRepository: IUserRepository;
	private readonly _userQuery: IUserQuery;
	constructor(
		@inject(TYPES.IUserRepository) userRepository: IUserRepository,
		@inject(TYPES.IUserQuery) userQuery: IUserQuery
	) {
		this._userRepository = userRepository;
		this._userQuery = userQuery;
	}

	public updateUserCommandHanlder(): UpdateUserCommandHandler {
		return new UpdateUserCommandHandler(this._userRepository);
	}

	public deleteUserCommandHanlder(): DeleteUserCommandHandler {
		return new DeleteUserCommandHandler(this._userRepository);
	}

	public getAllUsersQueryHanlder(): GetAllUsersQueryHandler {
		return new GetAllUsersQueryHandler(this._userQuery);
	}

	public getUserByIdQueryHanlder(): GetUserByIdQueryHandler {
		return new GetUserByIdQueryHandler(this._userQuery);
	}

	public getUserByEmailQueryHanlder(): GetUserByEmailQueryHandler {
		return new GetUserByEmailQueryHandler(this._userQuery);
	}
}
