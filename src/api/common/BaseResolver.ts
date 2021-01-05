import { UserInputError } from "apollo-server-express";
import { injectable } from "inversify";
import Result from "@src/domain/common/result";

@injectable()
export default class BaseResolver {
	public result<T>(result: Result<T>): T {
		if (result.failure) {
			throw new UserInputError(result.error);
		}

		return result.data;
	}
}
