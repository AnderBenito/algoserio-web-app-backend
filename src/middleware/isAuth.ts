import { verify } from "jsonwebtoken";
import { MyContext } from "src/models/MyContext";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
	const authorization = context.req.headers["authorization"];
	console.log("auth", authorization);
	if (!authorization) throw new Error("Not authenticated");

	try {
		const token = authorization?.split(" ")[1];
		const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
		context.payload = payload as any;
	} catch (e) {
		console.log(e);
		throw new Error("Not authenticated");
	}

	await next();
};
