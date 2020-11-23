import { User } from "./../entity/User";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Points } from "./../entity/Points";

enum OrderTypes {
	ASC = "ASC",
	DESC = "DESC",
}

@Resolver(Points)
export class PointsResolver {
	@Query(() => [Points])
	async getAllPoints() {
		return await Points.find({ relations: ["user"] });
	}

	@Query(() => [Points])
	async getPaginatedPoints(
		@Arg("skip", { nullable: true }) skip?: number,
		@Arg("take", { nullable: true }) take?: number,
		@Arg("order", { nullable: true, defaultValue: "ASC" }) order?: OrderTypes
	) {
		return await Points.find({
			order: {
				createdAt: order,
			},
			skip: skip,
			take: take,
		});
	}

	@Query(() => [Points])
	async getPointsById(@Arg("id") id: number) {
		return await Points.find({
			relations: ["user"],
			where: { user: { id: id } },
		});
	}

	@Query(() => [Points])
	async getPointsByUsername(@Arg("username") username: string) {
		const user = await User.findOne({ where: { username } });
		if (!user) {
			throw new Error(`User with username: ${username} not found`);
		}
		return await Points.find({
			relations: ["user"],
			where: { user: user },
		});
	}

	@Mutation(() => Boolean)
	async addPoints(
		@Arg("username") username: string,
		@Arg("amount") amount: number,
		@Arg("reason") reason: string
	) {
		const user = await User.findOne({ where: { username: username } });
		if (user) {
			await Points.insert({
				createdAt: new Date(),
				amount,
				reason,
				user,
			});
			return true;
		} else {
			throw new Error(`User with username: ${username} not found`);
		}
	}
}
