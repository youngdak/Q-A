import Result from "./result";

export default class ActionResult {
    public static ok<T>(data: T): Result<T> {
        return new Result<T>(data, undefined);
    }

    public static fail<T>(errors: any): Result<T> {
        return new Result<T>(undefined, errors);
    }
}