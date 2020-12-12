import Request from "../../interfaces/request";
import RequestHandler from "../../interfaces/requesthandler";
import { validate, IsNotEmpty, IsString } from "class-validator";
import IUserRepository from "../interfaces/userRepository";
import { injectable, inject } from "inversify";
import Result from "../../../domain/common/result";
import ActionResult from "../../../domain/common/actionresult";
import { TYPES } from "../../common/types";
import UserId from "../../../domain/users/userId";

export class DeleteUserCommand implements Request<Promise<Result<void>>> {
	@IsNotEmpty()
	@IsString()
	public id: string | undefined;

	public static create(body: { id: string }): DeleteUserCommand {
		var deleteUserCommand = new DeleteUserCommand();
		deleteUserCommand.id = body.id;

		return deleteUserCommand;
	}
}

@injectable()
export class DeleteUserCommandHandler
	implements RequestHandler<DeleteUserCommand, Promise<Result<void>>> {
	private readonly _userrepository: IUserRepository;
	constructor(@inject(TYPES.IUserRepository) userRepository: IUserRepository) {
		this._userrepository = userRepository;
	}

	public async handle(request: DeleteUserCommand): Promise<Result<void>> {
		const validationResult = await validate(request);
		if (validationResult.length > 0) {
			return ActionResult.fail(validationResult.map((x) => x.constraints));
		}

		const userId = UserId.create(request.id!);
		const user = await this._userrepository.getById(userId);
		if (!user) {
			return ActionResult.fail(
				`User with the id: '${request.id}' does not exist!`
			);
		}

		const result = await this._userrepository.delete(user);
		return ActionResult.ok(result);
	}
}
