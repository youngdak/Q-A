import * as dotenv from "dotenv";
dotenv.config({ path: `.${process.env.NODE_ENV!.trim()}.env` });

export default class EnvironmentVariable {
	public static readonly DATABASE_TYPE = process.env.DATABASE_TYPE;
	public static readonly DATABASE_NAME = process.env.DATABASE_NAME;
	public static readonly DATABASE_HOST = process.env.DATABASE_HOST;
	public static readonly DATABASE_USER = process.env.DATABASE_USER;
	public static readonly DATABASE_PORT = Number(process.env.DATABASE_PORT);
	public static readonly DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;

	public static readonly PORT = process.env.PORT;

	public static readonly SECRET_KEY = process.env.SECRET_KEY!;
}
