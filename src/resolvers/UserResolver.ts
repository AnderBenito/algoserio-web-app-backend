import { isAuth } from "./../middleware/isAuth";
import { sendRefreshToken } from "./../utils/sendRefreshToken";
import { MyContext } from "./../models/MyContext";
import { createAccessToken, createRefreshToken } from "./../utils/auth";
import { User } from "./../entity/User";
import {
	Arg,
	Mutation,
	Query,
	Resolver,
	ObjectType,
	Field,
	Ctx,
	UseMiddleware,
} from "type-graphql";
import { hash, genSalt, compare } from "bcrypt";

// @InputType()
// class GetRegisterArgs {
// 	@Field()
// 	name: string;

// 	@Field()
// 	username: string;

// 	@Field()
// 	password: string;
// }

enum OrderTypes {
	ASC = "ASC",
	DESC = "DESC",
}

@ObjectType()
class LoginResponse {
	@Field()
	accessToken: string;

	@Field()
	user: User;
}

@ObjectType()
class TotalPointsPerUserResponse {
	@Field()
	user: User;

	@Field()
	totalPoints: number;
}

@Resolver(User)
export class UserResolver {
	@Query(() => String)
	@UseMiddleware(isAuth)
	hello(@Ctx() { payload }: MyContext) {
		console.log(payload);
		return "Hello User";
	}

	@Query(() => User)
	@UseMiddleware(isAuth)
	async getCurrentUser(@Ctx() { payload }: MyContext) {
		return await User.findOne({ id: payload?.userId });
	}

	@Query(() => [User])
	async getAllUsers() {
		return await User.find({ relations: ["points"] });
	}

	@Query(() => [User])
	async getPaginatedUsers(
		@Arg("skip", { nullable: true }) skip?: number,
		@Arg("take", { nullable: true }) take?: number,
		@Arg("order", { nullable: true, defaultValue: "ASC" }) order?: OrderTypes
	) {
		return await User.find({
			relations: ["points"],
			order: {
				name: order,
			},
			skip: skip,
			take: take,
		});
	}

	@Query(() => [TotalPointsPerUserResponse])
	async getTotalPointsPerUSer() {
		const users = await User.find({ relations: ["points"] });

		const userTotal = users.map((user) => {
			let totalPoints;
			if (!user.points) {
				totalPoints = 0;
			} else {
				let pointsArray = user.points.map((point) => point.amount);
				totalPoints = pointsArray.reduce((a, b) => a + b, 0);
			}
			return {
				user: user,

				totalPoints: totalPoints,
			};
		});
		userTotal.sort((a, b) => b.totalPoints - a.totalPoints);

		return userTotal;
	}

	//Mutations-----------------------------------------------------------
	@Mutation(() => LoginResponse)
	async loginUser(
		@Arg("username") username: string,
		@Arg("password") password: string,
		@Ctx() { res }: MyContext
	) {
		const user = await User.findOne({ username });
		if (user) {
			const valid = await compare(password, user.password);
			if (valid) {
				//Login successfull
				console.log("Loging successfull");
				sendRefreshToken(res, createRefreshToken(user));
				return {
					accessToken: createAccessToken(user),
					user: user,
				};
			} else {
				throw new Error("Invalid username or password");
			}
		} else {
			throw new Error("Invalid username or password");
		}
	}

	@Mutation(() => Boolean)
	async logOutUser(@Ctx() { res }: MyContext) {
		//sendRefreshToken(res, "");
		res.clearCookie("jid");
		return true;
	}

	@Mutation(() => Boolean)
	async registerUser(
		@Arg("name") name: string,
		@Arg("email") email: string,
		@Arg("username") username: string,
		@Arg("password") password: string,
		@Arg("isAdmin", { defaultValue: false }) isAdmin?: boolean
	) {
		//Check if user exists in database-----------------------------
		let user = await User.findOne({ where: { email } });
		if (user) throw new Error(`User with email ${email} already exists!`);

		user = await User.findOne({ where: { username } });
		if (user) throw new Error(`User with username ${username} already exists!`);

		const salt = await genSalt(10);
		const hashedPassword = await hash(password, salt);

		try {
			await User.insert({
				createdAt: new Date(),
				name,
				email,
				username,
				password: hashedPassword,
				isAdmin,
			});
		} catch (error) {
			return false;
		}
		return true;
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async changeUserPassword(
		@Arg("oldPassword") oldPassword: string,
		@Arg("newPassword") newPassword: string,
		@Ctx() { payload }: MyContext
	) {
		const user = await User.findOne({ id: payload?.userId });

		if (!user) {
			throw new Error(`No user with id ${payload?.userId} found`);
		}

		const valid = await compare(oldPassword, user.password!);

		if (!valid) {
			throw new Error(`Wrong old password`);
		}

		const salt = await genSalt(10);
		const hashedPassword = await hash(newPassword, salt);

		user.password = hashedPassword;
		user.tokenVersion += 1;
		try {
			await User.save(user);
		} catch (e) {
			console.log(e);
			return false;
		}

		return true;
	}
}
