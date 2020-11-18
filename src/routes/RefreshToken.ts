import { createRefreshToken, createAccessToken } from "./../utils/auth";
import { sendRefreshToken } from "./../utils/sendRefreshToken";
import { User } from "./../entity/User";
import { verify } from "jsonwebtoken";
import express from "express";

export const router = express.Router();

router.get("/", (_, res) => {
	res.send("Hello walo");
});

router.post("/", async (req, res) => {
	const cookieToken: string = req.cookies.jid;

	if (!cookieToken) return res.status(400).send({ ok: false, accessToken: "" });

	let payload: any = null;
	try {
		payload = verify(cookieToken, process.env.REFRESH_TOKEN_SECRET!);
	} catch (error) {
		console.log(error);
		return res.status(400).send({ ok: false, accessToken: "" });
	}

	const user = await User.findOne({ id: payload.userId });
	if (!user) return res.status(400).send({ ok: false, accessToken: "" });

	sendRefreshToken(res, createRefreshToken(user));
	return res
		.status(200)
		.send({ ok: true, accessToken: createAccessToken(user) });
});
