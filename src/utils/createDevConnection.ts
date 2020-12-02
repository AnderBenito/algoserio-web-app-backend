import { createConnection, getConnectionOptions } from "typeorm";

export const createDevConnection = async () => {
	const connectionOptions = await getConnectionOptions();

	Object.assign(connectionOptions, {
		entities: ["src/entity/*.ts"],
		migrations: ["src/migration/*.ts"],
		subscribers: ["src/subscriber/*.ts"],
		cli: {
			entitiesDir: "src/entity",
			migrationsDir: "src/migration",
			subscribersDir: "src/subscriber",
		},
	});

	return createConnection(connectionOptions);
};
