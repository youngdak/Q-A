import { mongoose } from "./mongoDatabaseSetup";

export default interface BaseMap<T extends mongoose.Document> {
	schema: mongoose.Schema<any>;
	model: mongoose.Model<T, {}>;
}
