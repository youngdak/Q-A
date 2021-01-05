import Identity from "@src/domain/entitybase/identity";

export default abstract class LongIdentity implements Identity<number> {
    public static ID: string = "Id";
    id: number;

    constructor() {
        this.id = 0;
    }
}