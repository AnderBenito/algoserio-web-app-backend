import { Field, Float, ObjectType } from "type-graphql";
import { User } from "./User";
import { Gala } from "./Gala";
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
	@Field(() => String)
	@PrimaryGeneratedColumn("uuid")
	id: string;

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

	@Field(() => Gala, { nullable: true })
	@ManyToOne(() => Gala, (gala) => gala.points, { onDelete: "CASCADE" })
	gala?: Gala;
}
