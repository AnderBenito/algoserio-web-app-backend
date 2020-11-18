import "reflect-metadata";
import { router } from "./routes/RefreshToken";
import { PointsResolver } from "./resolvers/PointsResolver";
import { UserResolver } from "./resolvers/UserResolver";
import express from "express";
import cookieParser from "cookie-parser";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
require("dotenv").config();

(async () => {
	const app = express();
	const PORT = process.env.PORT || 5000;

	app.use(cookieParser());
	app.use("/auth/refresh_token", router);
	//Connect to DB----------------------------------
	await createConnection();

	//Initialize Apollo Server----------------------------------
	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [UserResolver, PointsResolver],
		}),
		context: ({ req, res }) => ({ req, res }),
	});

	apolloServer.applyMiddleware({ app });

	//----------------------------------------------------------
	app.listen(PORT, () => console.log("Express listening on port! ", PORT));
})();
