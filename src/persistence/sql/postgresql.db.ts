import { createConnection, Connection } from "typeorm";

export async function getPostgreSqlDbConnection(): Promise<Connection> {
    const conn = await createConnection({
        type: "postgres",
        host: DATABASE_HOST,
        port: DATABASE_PORT,
        username: DATABASE_USER,
        password: DATABASE_PASSWORD,
        database: DATABASE_DB,
        entities: [
            ENTITIES
        ],
        migrations: [
            MIGRATIONS
        ],
        cli: {
            entitiesDir: ENTITIESDIR,
            migrationsDir: MIGRATIONSDIR
        },
        synchronize: true
    });

    return conn;
}