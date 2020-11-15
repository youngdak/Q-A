import Request from "./request";

export default interface RequestHandler<TRequest extends Request<TResult>, TResult> {
    Handle(request: TRequest): TResult;
}