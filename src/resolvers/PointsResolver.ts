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
			relations: ["user"],
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

	//Mutations ----------------------------------

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

	@Mutation(() => Boolean)
	async deletePoints(@Arg("id") id: string) {
		try {
			await Points.delete(id);
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}

	@Mutation(() => Points)
	async updatePoints(
		@Arg("id") id: string,
		@Arg("amount", { nullable: true }) amount: number,
		@Arg("reason", { nullable: true }) reason: string
	) {
		let points = (await Points.findOne({ id: id })) as Points;
		if (points) {
			points.amount = amount ? amount : points.amount;
			points.reason = reason ? reason : points.reason;
		} else {
			throw new Error("Couldnt find points");
		}
		try {
			return await Points.save(points);
		} catch (e) {
			console.log(e);
			throw new Error("Couldnt find points");
		}
	}
}
