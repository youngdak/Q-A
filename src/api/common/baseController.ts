import Result from "@src/domain/common/result";
import { injectable } from "inversify";
import { BaseHttpController } from "inversify-express-utils";

@injectable()
export default abstract class BaseController extends BaseHttpController {
	public result<T>(result: Result<T>) {
		return result.success
			? this.ok(result.data)
			: this.badRequest(result.error);
	}
}
