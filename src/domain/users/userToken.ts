import EntityBase from "../entitybase/entitybase";
import UserTokenId from "./userTokenId";
import { v4 as uuidv4 } from 'uuid';
import Result from "../common/result";
import ActionResult from "../common/actionresult";

export interface IUserToken {
    token: string;
    device: string;
    refreshToken: string;
}

export default class UserToken extends EntityBase<UserTokenId> implements IUserToken {
    private _token: string;
    private _device: string;
    private _refreshToken: string;

    private constructor(userTokenId: UserTokenId, token: string, refreshToken: string, device: string) {
        super();
        this._token = token;
        this._refreshToken = refreshToken;
        this._device = device;
        this._id = userTokenId;
    }

    public get token(): string {
        return this._token;
    }

    public get device(): string {
        return this._device;
    }

    public get refreshToken(): string {
        return this._refreshToken;
    }

    public update(token: string, refreshToken: string): Result<void> {
        if (token == undefined || token == null || token.length <= 0) {
            return ActionResult.fail("token should not be null or empty");
        }

        if (refreshToken == undefined || refreshToken == null || refreshToken.length <= 0) {
            return ActionResult.fail("refresh token should not be null or empty");
        }

        this._token = token;

        return ActionResult.ok(undefined);
    }

    public static create(token: string, refreshToken: string, device: string): Result<UserToken>;
    public static create(token: string, refreshToken: string, device: string, userTokenId: UserTokenId): Result<UserToken>;
    public static create(token: string, refreshToken: string, device: string, userTokenId?: UserTokenId): Result<UserToken>{
        if (token == undefined || token == null || token.length <= 0) {
            return ActionResult.fail("token should not be null or empty");
        }

        if (refreshToken == undefined || refreshToken == null || refreshToken.length <= 0) {
            return ActionResult.fail("refresh token should not be null or empty");
        }
        
        if (device == undefined || device == null || device.length <= 0) {
            return ActionResult.fail("device should not be null or empty");
        }

        const id = userTokenId ?? UserTokenId.create(uuidv4());
        var userToken = new UserToken(id, token, refreshToken, device);
        return ActionResult.ok(userToken);
    }
}