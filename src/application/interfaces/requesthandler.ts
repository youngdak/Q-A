import Request from "@src/application/interfaces/request";

export default interface RequestHandler<TRequest extends Request<TResult>, TResult> {
    handle(request: TRequest): TResult;
}