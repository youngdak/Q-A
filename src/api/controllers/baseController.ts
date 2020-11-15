import { Request, Response } from "express";
import Result from "../../domain/common/result";
import { injectable } from "inversify";
import { BaseHttpController } from "inversify-express-utils";

@injectable()
export default abstract class BaseController extends BaseHttpController {
    // public ok(res: Response, data: any): Response<any> {
    //     return res.status(200).json(data);
    // }

    // public badRequest(res: Response, error: any): Response<any> {
    //     return res.status(400).json(error);
    // }

    // public internalServerError(res: Response, error: any): Response<any> {
    //     return res.status(500).json(error);
    // }

    public result<T>(res: Response, result: Result<T>): Response<any> {
        return result.success ? res.status(200).json(result.data) : res.status(400).json({ error: result.error });
    }
}