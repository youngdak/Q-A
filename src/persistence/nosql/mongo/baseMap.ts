import { mongoose } from "@src/persistence/nosql/mongo/mongoDatabaseSetup";

export default interface BaseMap<T extends mongoose.Document> {
	schema: mongoose.Schema<any>;
	model: mongoose.Model<T, {}>;
}
