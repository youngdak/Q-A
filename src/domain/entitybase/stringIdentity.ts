import Identity from "./identity";

export default abstract class StringIdentity implements Identity<string> {
    public static ID: string = "Id";
    id: string;

    constructor() {
        this.id = "";
    }
}