import { Request } from "express";
import { inject } from "inversify";
import {
	controller,
	request,
	httpGet,
	httpPatch,
	interfaces,
	httpPost,
	httpDelete,
} from "inversify-express-utils";
import { TYPES } from "@src/application/common/types";
import TagServiceLocator from "@src/application/tags/tagServiceLocator";
import BaseController from "@src/api/common/baseController";
import { GetTagByIdQuery } from "@src/application/tags/queries/getTagById";
import { UpdateTagCommand } from "@src/application/tags/commands/updateTagCommand";
import AuthMiddleware from "@src/application/auth/provider/authMiddleware";
import { CreateTagCommand } from "@src/application/tags/commands/createTagCommand";
import { DeleteTagCommand } from "@src/application/tags/commands/deleteTagCommand";

@controller("/tags")
export default class TagsController extends BaseController {
	private readonly _tagServiceLocator: TagServiceLocator;
	constructor(
		@inject(TYPES.TagServiceLocator) tagServiceLocator: TagServiceLocator
	) {
		super();
		this._tagServiceLocator = tagServiceLocator;
	}

	@httpGet("/:id", AuthMiddleware)
	public async getById(
		@request() req: Request
	): Promise<interfaces.IHttpActionResult> {
		const getTagByIdQuery = GetTagByIdQuery.create(
			req.params as { id: string }
		);
		const result = await this._tagServiceLocator
			.getTagByIdQueryHanlder()
			.handle(getTagByIdQuery);

		return this.result(result);
	}

	@httpPost("/", AuthMiddleware)
	public async createTag(
		@request() req: Request
	): Promise<interfaces.IHttpActionResult> {
		const createTagCommand = CreateTagCommand.create(req.body);
		createTagCommand.req = req;

		const result = await this._tagServiceLocator
			.createTagCommandHanlder()
			.handle(createTagCommand);

		return this.result(result);
	}

	@httpPatch("/:id", AuthMiddleware)
	public async update(
		@request() req: Request
	): Promise<interfaces.IHttpActionResult> {
		const updateTagCommand = UpdateTagCommand.create(req.params.id, req.body);
		const result = await this._tagServiceLocator
			.updateTagCommandHanlder()
			.handle(updateTagCommand);

		return this.result(result);
	}

	@httpDelete("/:id", AuthMiddleware)
	public async deleteTag(
		@request() req: Request
	): Promise<interfaces.IHttpActionResult> {
		const deleteTagCommand = DeleteTagCommand.create(req.params.id);
		const result = await this._tagServiceLocator
			.deleteTagCommandHanlder()
			.handle(deleteTagCommand);

		return this.result(result);
	}
}
