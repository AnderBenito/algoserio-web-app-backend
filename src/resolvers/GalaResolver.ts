import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Gala } from "./../entity/Gala";

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
			gala = await Gala.findOne({
				where: { id },
				relations: ["points", "points.user"],
			});
			return gala;
		} catch (error) {
			throw new Error(`Gala with ID ${id} not found`);
		}
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
