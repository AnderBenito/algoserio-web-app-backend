import { Points } from "./Points";
import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column("timestamp")
	createdAt: Date;

	@Field()
	@Column("text")
	name: string;

	@Field()
	@Column("text")
	username: string;

	@Field()
	@Column("text")
	email: string;

	@Column("text")
	password: string;

	@Field(() => [Points], { nullable: true })
	@OneToMany(() => Points, (points) => points.user)
	points?: Points[];
}
