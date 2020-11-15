import StringIdentity from "../entitybase/stringIdentity";

export default class UserTokenId extends StringIdentity {
    private constructor() {
        super();
    }

    public get Id(): string | undefined {
        return this.id;
    }

    public static create(id?: string): UserTokenId {
        const newUser = new UserTokenId();
        if (id != undefined) {
            newUser.id = id;
        }

        return newUser;
    }
}