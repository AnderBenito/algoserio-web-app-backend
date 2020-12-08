import { TotalPointsPerUserResponse } from "./responses";
import { User } from "./../entity/User";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Gala } from "./../entity/Gala";
import { getRepository } from "typeorm";

@Resolver(Gala)
export class GalaResolver {
	@Query(() => [Gala])
	async getAllGalas() {
		return await Gala.find({ relations: ["points", "points.user"] });
	}

	@Query(() => Gala)
	async getAllGalaPoints(@Arg("id") id: string) {
		let gala = null;

		try {
			// gala = await Gala.findOne({
			// 	where: { id },
			// 	relations: ["points", "points.user"],
			// });
			gala = await getRepository(Gala)
				.createQueryBuilder("gala")
				.where("gala.id = :id", { id: id })
				.leftJoinAndSelect("gala.points", "points")
				.leftJoinAndSelect("points.user", "user")
				.orderBy("points.createdAt", "DESC")
				.getOne();
			return gala;
		} catch (error) {
			throw new Error(`Gala with ID ${id} not found`);
		}
	}

	@Query(() => [TotalPointsPerUserResponse])
	async getGalaTotalPoints(@Arg("id") id: string) {
		const users = await getRepository(User)
			.createQueryBuilder("user")
			.leftJoinAndSelect("user.points", "points")
			.leftJoinAndSelect("points.gala", "gala")
			.where("gala.id = :id", { id: id })
			.getMany();

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

	//Mutations---------------------------------------------
	@Mutation(() => Boolean)
	async addGala(
		@Arg("name") name: string,
		@Arg("initDate") initDate: string,
		@Arg("finishDate") finishDate: string
	) {
		const date1 = Date.parse(initDate);
		const date2 = Date.parse(finishDate);

		if (isNaN(date1) || isNaN(date2)) {
			throw new Error("Wrong date types");
		}

		try {
			await Gala.insert({
				createdAt: new Date(),
				name,
				initDate: initDate,
				finishDate: finishDate,
			});
			return true;
		} catch (error) {
			throw new Error("Error");
		}
	}

	@Mutation(() => Boolean)
	async deleteGala(@Arg("id") id: string) {
		const gala = await Gala.findOne({ id });

		if (gala) {
			gala.remove();
			return true;
		} else {
			throw new Error("Could not find gala");
		}
	}
}
