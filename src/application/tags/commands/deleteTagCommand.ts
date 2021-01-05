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
export class DeleteTagCommand implements Request<Promise<Result<void>>> {
	@Field()
	@IsNotEmpty()
	@IsString()
	public id: string;

	public static create(id: string): DeleteTagCommand {
		var deleteTagCommand = new DeleteTagCommand();
		deleteTagCommand.id = id;

		return deleteTagCommand;
	}
}

@injectable()
export class DeleteTagCommandHandler
	implements RequestHandler<DeleteTagCommand, Promise<Result<void>>> {
	private readonly _tagrepository: ITagRepository;
	constructor(@inject(TYPES.ITagRepository) tagRepository: ITagRepository) {
		this._tagrepository = tagRepository;
	}

	public async handle(request: DeleteTagCommand): Promise<Result<void>> {
		const validationResult = await validate(request);
		if (validationResult.length > 0) {
			return ActionResult.fail(validationResult.map((x) => x.constraints));
		}

		const tagId = TagId.create(request.id!);
		const tag = await this._tagrepository.getById(tagId);
		if (!tag) {
			return ActionResult.fail(
				`Tag with the id: '${request.id}' does not exist!`
			);
		}

		const result = await this._tagrepository.delete(tag);
		return ActionResult.ok(result);
	}
}
