import { Response } from "express";

export const sendRefreshToken = (res: Response, token: string) => {
	return res.cookie("jid", token, {
		httpOnly: true,
		domain:
			process.env.NODE_ENV === "production"
				? "https://algoserio.herokuapp.com/"
				: "http://localhost:5000",
	});
};
