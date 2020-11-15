import StringIdentity from "../entitybase/stringIdentity";

export default class UserId extends StringIdentity {
    private constructor() {
        super();
    }

    public get Id(): string | undefined {
        return this.id;
    }

    public static create(id?: string): UserId {
        const newUser = new UserId();
        if (id != undefined) {
            newUser.id = id;
        }

        return newUser;
    }
}

// import LongIdentity from "../entitybase/longIdentity";

// export default class UserId extends LongIdentity {
//     constructor() {
//         super();
//         this.id = 0;
//     }

//     public get Id(): number {
//         return this.id;
//     }

//     public static create(id: number): UserId {
//         const newUser = new UserId();
//         newUser.id = id;

//         return newUser;
//     }
// }