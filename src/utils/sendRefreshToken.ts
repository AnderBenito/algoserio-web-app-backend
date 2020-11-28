import { Response } from "express";

export const sendRefreshToken = (res: Response, token: string) => {
	return res.cookie("jid", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		domain:
			process.env.NODE_ENV === "production"
				? "algoserio.herokuapp.com"
				: "localhost",
	});
};
