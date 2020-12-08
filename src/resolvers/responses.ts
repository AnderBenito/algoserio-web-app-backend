import { User } from "./../entity/User";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class TotalPointsPerUserResponse {
	@Field()
	user: User;

	@Field()
	totalPoints: number;
}
