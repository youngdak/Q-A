import Request from "@src/application/interfaces/request";
import RequestHandler from "@src/application/interfaces/requesthandler";
import { validate, IsNotEmpty, IsString } from "class-validator";
import ITagRepository from "@src/application/tags/interfaces/tagRepository";
import { injectable, inject } from "inversify";
import Result from "@src/domain/common/result";
import ActionResult from "@src/domain/common/actionresult";
import { TYPES } from "@src/application/common/types";
import { Field, InputType } from "type-graphql";
import Tag from "@src/domain/tags/tag";
import UserDto from "@src/application/users/queries/userDto";
import * as exp from "express";

@InputType()
export class CreateTagCommand
	implements Request<Promise<Result<string | number>>> {
	@Field()
	@IsNotEmpty()
	@IsString()
	public name: string;

	@Field()
	@IsNotEmpty()
	@IsString()
	public description: string;

	public req: exp.Request;

	public static create(body: {
		name: string;
		description: string;
	}): CreateTagCommand {
		var createTagCommand = new CreateTagCommand();
		createTagCommand.name = body.name;
		createTagCommand.description = body.description;

		return createTagCommand;
	}
}

@injectable()
export class CreateTagCommandHandler
	implements
		RequestHandler<CreateTagCommand, Promise<Result<string | number>>> {
	private readonly _tagrepository: ITagRepository;
	constructor(@inject(TYPES.ITagRepository) tagRepository: ITagRepository) {
		this._tagrepository = tagRepository;
	}

	public async handle(
		request: CreateTagCommand
	): Promise<Result<string | number>> {
		const validationResult = await validate(request);
		if (validationResult.length > 0) {
			return ActionResult.fail(validationResult.map((x) => x.constraints));
		}

		const tagExistByName = await this._tagrepository.tagExistByName(
			request.name!
		);

		if (tagExistByName) {
			return ActionResult.fail(
				`A tag with the name: '${request.name}' already exist!`
			);
		}

		var loggedInUser = UserDto.userDtoFromExpress(request.req.user!).data;
		var tag = Tag.create(
			request.name!,
			request.description!,
			loggedInUser.email
		);

		if (tag.failure) {
			return ActionResult.fail(tag.error);
		}

		const result = await this._tagrepository.save(tag.data);
		return ActionResult.ok(result);
	}
}
