import Request from "../../interfaces/request";
import RequestHandler from "../../interfaces/requesthandler";
import { validate, IsNotEmpty, IsString } from "class-validator";
import IUserRepository from "../interfaces/userRepository";
import { injectable, inject } from "inversify";
import Result from "../../../domain/common/result";
import ActionResult from "../../../domain/common/actionresult";
import { TYPES } from "../../common/types";
import UserId from "../../../domain/users/userId";
import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateUserCommand
	implements Request<Promise<Result<string | number>>> {
	@Field()
	@IsNotEmpty()
	@IsString()
	public id: string;

	@Field()
	@IsNotEmpty()
	@IsString()
	public firstName: string;

	@Field()
	@IsNotEmpty()
	@IsString()
	public lastName: string;

	@Field()
	@IsNotEmpty()
	@IsString()
	public otherName: string;

	public static create(
		id: string,
		body: { firstName: string; lastName: string; otherName: string }
	): UpdateUserCommand {
		var updateUserCommand = new UpdateUserCommand();
		updateUserCommand.id = id;
		updateUserCommand.firstName = body.firstName;
		updateUserCommand.lastName = body.lastName;
		updateUserCommand.otherName = body.otherName;

		return updateUserCommand;
	}
}

@injectable()
export class UpdateUserCommandHandler
	implements
		RequestHandler<UpdateUserCommand, Promise<Result<string | number>>> {
	private readonly _userrepository: IUserRepository;
	constructor(@inject(TYPES.IUserRepository) userRepository: IUserRepository) {
		this._userrepository = userRepository;
	}

	public async handle(
		request: UpdateUserCommand
	): Promise<Result<string | number>> {
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

		var updateResult = user.update(
			request.firstName!,
			request.lastName!,
			request.otherName!
		);
		if (updateResult.failure) {
			return ActionResult.fail(updateResult.error);
		}

		const result = await this._userrepository.update(user);
		return ActionResult.ok(result);
	}
}
