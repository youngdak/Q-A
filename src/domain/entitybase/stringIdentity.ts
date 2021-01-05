import Identity from "@src/domain/entitybase/identity";

export default abstract class StringIdentity implements Identity<string> {
    public static ID: string = "Id";
    id: string;

    constructor() {
        this.id = "";
    }
}