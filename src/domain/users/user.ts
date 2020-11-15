import EntityBase from "../entitybase/entitybase";
import UserId from "./userId";
import { v4 as uuidv4 } from 'uuid';
import Result from "../common/result";
import ActionResult from "../common/actionresult";
import UserToken from "./userToken";
import UserTag from "./userTag";
import _ from "lodash"

export interface IUser {
    firstName: string;
    lastName: string;
    otherName: string;
    email: string;
    password: string;
}

export default class User extends EntityBase<UserId> implements IUser {
    private _firstName: string;
    private _lastName: string;
    private _otherName: string;
    private _email: string;
    private _password: string;
    private _tags: UserTag[];
    private _tokens: UserToken[];

    private constructor(userId: UserId, firstName: string, lastName: string, otherName: string, email: string, password: string) {
        super();
        this._firstName = firstName;
        this._lastName = lastName;
        this._otherName = otherName;
        this._email = email;
        this._password = password;
        this._tokens = [];
        this._tags = [];

        this._id = userId;
    }

    public get firstName(): string {
        return this._firstName;
    }

    public get lastName(): string {
        return this._lastName;
    }

    public get otherName(): string {
        return this._otherName;
    }

    public get email(): string {
        return this._email;
    }

    public get password(): string {
        return this._password;
    }

    public get tokens(): UserToken[] {
        return this._tokens.slice();
    }

    public get tags(): UserTag[] {
        return this._tags.slice();
    }

    public manageTags(tags: UserTag[]): void {
        const incomingTags = tags.slice();
        const existingTags = this._tags.slice();
        const distinct = _.intersectionWith(incomingTags, existingTags, _.isEqual);
        const removing = _.differenceWith(existingTags, distinct, _.isEqual);
        const adding = _.differenceWith(incomingTags, distinct, _.isEqual);

        this._tags = _.differenceWith(this._tags, removing, _.isEqual);
        adding.forEach(x => this._tags.push(x));
    }

    public addOrUpdateToken(token: UserToken): void {
        const existingToken = this._tokens.find(x => x.device == token.device);
        existingToken == undefined ? this._tokens.push(token) : existingToken.update(token.token, token.refreshToken);
    }

    public removeToken(token: UserToken): Result<void> {
        const existingToken = this._tokens.find(x => x.id?.Id == token.id?.Id);
        if (!existingToken) {
            return ActionResult.fail("token does not exist!");
        }

        this._tokens = this._tokens.filter(x => x !== existingToken);
        return ActionResult.ok(undefined);
    }

    public removeAllTokens(): Result<void> {
        this._tokens = [];
        return ActionResult.ok(undefined);
    }

    public update(firstName: string, lastName: string, otherName: string): Result<void> {
        if (firstName == undefined || firstName == null || firstName.length <= 0) {
            return ActionResult.fail("first name should not be null or empty");
        }

        if (lastName == undefined || lastName == null || lastName.length <= 0) {
            return ActionResult.fail("last name should not be null or empty");
        }

        this._firstName = firstName;
        this._lastName = lastName;

        return ActionResult.ok(undefined);
    }

    public static create(firstName: string, lastName: string, otherName: string, email: string, password: string): Result<User>;
    public static create(firstName: string, lastName: string, otherName: string, email: string, password: string, userId: UserId): Result<User>;
    public static create(firstName: string, lastName: string, otherName: string, email: string, password: string, userId?: UserId): Result<User> {
        if (firstName == undefined || firstName == null || firstName.length <= 0) {
            return ActionResult.fail("first name should not be null or empty");
        }

        if (lastName == undefined || lastName == null || lastName.length <= 0) {
            return ActionResult.fail("last name should not be null or empty");
        }

        if (email == undefined || email == null || email.length <= 0) {
            return ActionResult.fail("email should not be null or empty");
        }

        if (password == undefined || password == null || password.length <= 0) {
            return ActionResult.fail("password should not be null or empty");
        }

        const id = userId ?? UserId.create(uuidv4());
        var user = new User(id, firstName, lastName, otherName, email, password);
        return ActionResult.ok(user);
    }
}