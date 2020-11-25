module.exports = {
	type: "postgres",
	host: process.env.DATABASE_URL,
	port: process.env.DATABASE_PORT,
	username: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	synchronize: true,
	logging: false,
	entities: ["dist/entity/*.js"],
	migrations: ["dist/migration/*.js"],
	subscribers: ["dist/subscriber/*.js"],
	cli: {
		entitiesDir: "dist/entity",
		migrationsDir: "dist/migration",
		subscribersDir: "dist/subscriber",
	},
};
