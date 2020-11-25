module.exports = {
	type: "postgres",
	url: process.env.DATABASE_URL,
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
