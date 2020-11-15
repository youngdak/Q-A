import { interfaces } from "inversify";
import mongodbBindings from "./mongo/inversify.config.mongodb";

export default async function nosqlBindings(bind: interfaces.Bind) {
    // Connect to Mongo database
    await mongodbBindings(bind);
}