import StringIdentity from "./stringIdentity";

export default abstract class EntityBase<TId extends StringIdentity> {
    protected _id: TId | null;
    protected constructor() {
        this._id = null;
    }

    public get id(): TId | null {
        return this._id;
    }
}


// import LongIdentity from "./longIdentity";
// export default abstract class EntityBase<TId extends LongIdentity> {
//     protected _id: TId | null;
//     constructor() {
//         this._id = null;
//     }

//     public get id(): TId | null {
//         return this._id;
//     }
// }