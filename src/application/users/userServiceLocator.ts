import IUserRepository from "@src/application/users/interfaces/userRepository";
import { inject, injectable } from "inversify";
import { GetAllUsersQueryHandler } from "@src/application/users/queries/getAllUsers";
import IUserQuery from "@src/application/users/interfaces/userQuery";
import { GetUserByIdQueryHandler } from "@src/application/users/queries/getUserById";
import { UpdateUserCommandHandler } from "@src/application/users/commands/updateUserCommand";
import { DeleteUserCommandHandler } from "@src/application/users/commands/deleteUserCommand";
import { GetUserByEmailQueryHandler } from "@src/application/users/queries/getUserByEmail";
import { AssignTagsToUserCommandHandler } from "@src/application/users/commands/assignTagsToUserCommand";
import ITagRepository from "@src/application/tags/interfaces/tagRepository";
import { TYPES } from "@src/application/common/types";
import { GetUsersOfTagQueryHandler } from "./queries/getUsersOfTag";

@injectable()
export default class UserServiceLocator {
	private readonly _userRepository: IUserRepository;
	private readonly _userQuery: IUserQuery;
	private readonly _tagRepository: ITagRepository;
	constructor(
		@inject(TYPES.IUserRepository) userRepository: IUserRepository,
		@inject(TYPES.IUserQuery) userQuery: IUserQuery,
		@inject(TYPES.ITagRepository) tagRepository: ITagRepository
	) {
		this._userRepository = userRepository;
		this._userQuery = userQuery;
		this._tagRepository = tagRepository;
	}

	public updateUserCommandHanlder(): UpdateUserCommandHandler {
		return new UpdateUserCommandHandler(this._userRepository);
	}

	public deleteUserCommandHanlder(): DeleteUserCommandHandler {
		return new DeleteUserCommandHandler(this._userRepository);
	}

	public assignTagsToUserCommandHanlder(): AssignTagsToUserCommandHandler {
		return new AssignTagsToUserCommandHandler(
			this._userRepository,
			this._tagRepository
		);
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

	public getUsersOfTagQueryHanlder(): GetUsersOfTagQueryHandler {
		return new GetUsersOfTagQueryHandler(this._userQuery);
	}
}
