import { Field, Float, ObjectType } from "type-graphql";
import { User } from "./User";
import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";

@ObjectType()
@Entity("points")
export class Points extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column("timestamp")
	createdAt: Date;

	@Field(() => Float)
	@Column("float")
	amount: number;

	@Field()
	@Column("text")
	reason: string;

	@Field(() => User, { nullable: true })
	@ManyToOne(() => User, (user) => user.points, { onDelete: "CASCADE" })
	user?: User;
}
