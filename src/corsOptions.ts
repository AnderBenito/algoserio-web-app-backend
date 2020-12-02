export const corsOptions = {
	origin:
		process.env.NODE_ENV === "production"
			? "https://algoserio.herokuapp.com"
			: "http://localhost:3000",
	credentials: true,
};
