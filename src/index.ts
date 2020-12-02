import { corsOptions } from "./corsOptions";
import { GalaResolver } from "./resolvers/GalaResolver";
import { createDevConnection } from "./utils/createDevConnection";
import "reflect-metadata";
import { router } from "./routes/RefreshToken";
import { PointsResolver } from "./resolvers/PointsResolver";
import { UserResolver } from "./resolvers/UserResolver";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
require("dotenv").config();

(async () => {
	console.log(process.env.NODE_ENV);
	const app = express();
	const PORT = process.env.PORT || 5000;

	app.use(cors(corsOptions));
	app.use(cookieParser());

	app.get("/", (_, res) => {
		res.send("Hello World");
	});

	app.use("/auth/refresh_token", router);
	//Connect to DB----------------------------------
	if (process.env.NODE_ENV === "production") {
		await createConnection();
	} else {
		await createDevConnection();
	}

	//Initialize Apollo Server----------------------------------
	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [UserResolver, PointsResolver, GalaResolver],
		}),
		context: ({ req, res }) => ({ req, res }),
	});

	apolloServer.applyMiddleware({ app, cors: false });

	//----------------------------------------------------------
	app.listen(PORT, () => console.log("Express listening on port! ", PORT));
})();
