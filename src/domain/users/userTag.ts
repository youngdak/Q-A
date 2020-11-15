import EntityBase from "../entitybase/entitybase";
import UserTagId from "./userTagId";
import { v4 as uuidv4 } from 'uuid';
import Result from "../common/result";
import ActionResult from "../common/actionresult";

export interface IUserTag {
    name: string;
}

export default class UserTag extends EntityBase<UserTagId> implements IUserTag {
    private _name: string;

    private constructor(userTagId: UserTagId, name: string) {
        super();
        this._name = name;
        this._id = userTagId;
    }

    public get name(): string {
        return this._name;
    }

    public update(name: string): Result<void> {
        if (name == undefined || name == null || name.length <= 0) {
            return ActionResult.fail("name should not be null or empty");
        }

        this._name = name;

        return ActionResult.ok(undefined);
    }

    public static create(name: string): Result<UserTag>;
    public static create(name: string, userTagId: UserTagId): Result<UserTag>;
    public static create(name: string, userTagId?: UserTagId): Result<UserTag>{
        if (name == undefined || name == null || name.length <= 0) {
            return ActionResult.fail("name should not be null or empty");
        }

        const id = userTagId ?? UserTagId.create(uuidv4());
        var userTag = new UserTag(id, name);
        return ActionResult.ok(userTag);
    }
}