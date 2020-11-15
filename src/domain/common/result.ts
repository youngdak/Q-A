export default class Result<T> {
    private _errors?: any;
    private _data?: T;
    private _success: boolean;
    constructor(data?: T, errors?: any) {
        this._errors = errors;
        this._data = data;
        this._success = errors === undefined;
    }

    public get data(): T {
        return this._data!;
    }

    public get error(): any {
        return this._errors!;
    }

    public get success(): boolean {
        return this._success;
    }

    public get failure(): boolean {
        return !this._success;
    }
}