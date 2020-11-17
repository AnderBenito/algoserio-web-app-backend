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

@ObjectType()
class LoginResponse {
	@Field()
	accessToken: string;
}
@Resolver(User)
export class UserResolver {
	@Query(() => String)
	@UseMiddleware(isAuth)
	hello(@Ctx() { payload }: MyContext) {
		console.log(payload);
		return "Hello User";
	}

	@Query(() => [User])
	async getAllUsers() {
		return await User.find({ relations: ["points"] });
	}

	@Mutation(() => LoginResponse)
	async loginUser(
		@Arg("username") username: string,
		@Arg("password") password: string,
		@Ctx() { res }: MyContext
	) {
		//console.log(res);
		const user = await User.findOne({ username });
		if (user) {
			const valid = await compare(password, user.password);
			if (valid) {
				//Login successfull
				sendRefreshToken(res, createRefreshToken(user));
				return {
					accessToken: createAccessToken(user),
				};
			} else {
				throw new Error("Invalid username or password");
			}
		} else {
			throw new Error("Invalid username or password");
		}
	}

	@Mutation(() => Boolean)
	async registerUser(
		@Arg("name") name: string,
		@Arg("email") email: string,
		@Arg("username") username: string,
		@Arg("password") password: string,
		@Arg("isAdmin", { defaultValue: false }) isAdmin?: boolean
	) {
		console.log(name, username, password);

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
}
