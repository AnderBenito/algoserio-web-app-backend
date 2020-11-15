import { PointsResolver } from "./resolvers/PointsResolver";
import "reflect-metadata";
import { UserResolver } from "./resolvers/UserResolver";
import { Points } from "./entity/Points";
import { User } from "./entity/User";
import express from "express";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

(async () => {
	const app = express();
	const PORT = process.env.PORT || 5000;

	//Connect to DB----------------------------------
	await createConnection();

	// User.insert({
	// 	createdAt: new Date(),
	// 	name: "Ander",
	// 	username: "grovertroter",
	// 	email: "email.com",
	// 	password: "martinez",
	// });

	const users = await User.find({ relations: ["points"] });
	console.log("---------------------", users);

	const points = await Points.find();
	console.log("---------------------", points);

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
