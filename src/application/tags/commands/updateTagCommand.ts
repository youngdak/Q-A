import Request from "@src/application/interfaces/request";
import RequestHandler from "@src/application/interfaces/requesthandler";
import { validate, IsNotEmpty, IsString } from "class-validator";
import ITagRepository from "@src/application/tags/interfaces/tagRepository";
import { injectable, inject } from "inversify";
import Result from "@src/domain/common/result";
import ActionResult from "@src/domain/common/actionresult";
import { TYPES } from "@src/application/common/types";
import TagId from "@src/domain/tags/tagId";
import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateTagCommand
	implements Request<Promise<Result<string | number>>> {
	@Field()
	@IsNotEmpty()
	@IsString()
	public id: string;

	@Field()
	@IsNotEmpty()
	@IsString()
	public name: string;

	@Field()
	@IsNotEmpty()
	@IsString()
	public description: string;

	public static create(
		id: string,
		body: { name: string; description: string }
	): UpdateTagCommand {
		var updateTagCommand = new UpdateTagCommand();
		updateTagCommand.id = id;
		updateTagCommand.name = body.name;
		updateTagCommand.description = body.description;

		return updateTagCommand;
	}
}

@injectable()
export class UpdateTagCommandHandler
	implements
		RequestHandler<UpdateTagCommand, Promise<Result<string | number>>> {
	private readonly _tagrepository: ITagRepository;
	constructor(@inject(TYPES.ITagRepository) tagRepository: ITagRepository) {
		this._tagrepository = tagRepository;
	}

	public async handle(
		request: UpdateTagCommand
	): Promise<Result<string | number>> {
		const validationResult = await validate(request);
		if (validationResult.length > 0) {
			return ActionResult.fail(validationResult.map((x) => x.constraints));
		}

		const tagId = TagId.create(request.id!);
		const tagById = await this._tagrepository.getById(tagId);
		if (!tagById) {
			return ActionResult.fail(
				`Tag with the id: '${request.id}' does not exist!`
			);
		}

		const tagByName = await this._tagrepository.getByName(request.name);
		if (tagByName && tagByName.id?.Id !== tagById.id?.Id) {
			return ActionResult.fail(
				`Tag with the name: '${request.name}' already exist!`
			);
		}

		var updateResult = tagById.update(request.name!, request.description!);
		if (updateResult.failure) {
			return ActionResult.fail(updateResult.error);
		}

		const result = await this._tagrepository.update(tagById);
		return ActionResult.ok(result);
	}
}
