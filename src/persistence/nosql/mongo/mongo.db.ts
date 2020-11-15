import mongoose from "mongoose";

export async function getMongoDbConnection(): Promise<typeof mongoose> {
    const DATABASE_HOST = process.env.DATABASE_HOST || "localhost";
    const DATABASE_USER = process.env.DATABASE_USER || "";
    const DATABASE_PORT = 27017;
    const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || "";
    const DATABASE_DB = "demo";

    const conn = await mongoose.connect(`mongodb://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });

    return conn;
}

export default mongoose;