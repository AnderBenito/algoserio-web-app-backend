import { Points } from "./Points";
import { Field, ObjectType } from "type-graphql";
import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";

@ObjectType()
@Entity("galas")
export class Gala extends BaseEntity {
	@Field(() => String)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@Column("text")
	name: string;

	@Field()
	@Column("timestamp")
	createdAt: Date;

	@Field()
	@Column("timestamp")
	initDate: Date;

	@Field()
	@Column("timestamp")
	finishDate: Date;

	@Field(() => [Points], { nullable: true })
	@OneToMany(() => Points, (points) => points.gala)
	points?: Points[];
}
