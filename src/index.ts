import "reflect-metadata";
import { PointsResolver } from "./resolvers/PointsResolver";
import { UserResolver } from "./resolvers/UserResolver";
import express from "express";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
require("dotenv").config();

(async () => {
	const app = express();
	const PORT = process.env.PORT || 5000;

	//Connect to DB----------------------------------
	await createConnection();

	//Initialize Apollo Server----------------------------------
	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [UserResolver, PointsResolver],
		}),
	});

	apolloServer.applyMiddleware({ app });

	//----------------------------------------------------------
	app.listen(PORT, () => console.log("Express listening on port! ", PORT));
})();
