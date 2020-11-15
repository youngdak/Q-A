import User, { IUser } from "../../../domain/users/user";
import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import UserId from "../../../domain/users/userId";
import UserTokenMap from "./userToken.map";
import UserTagMap from "./userTag.map";

@Entity("User")
export default class UserMap implements IUser {
	@PrimaryColumn()
	id: string;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column({ nullable: true })
	otherName: string;

	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@OneToMany(() => UserTokenMap, (tokenMap) => tokenMap.user, {
		cascade: ["insert", "update"],
	})
	tokens: UserTokenMap[];

	@OneToMany(() => UserTagMap, (tagMap) => tagMap.user, {
		cascade: ["insert", "update"],
	})
	tags: UserTagMap[];

	public static userMap(user: User): UserMap {
		const userMap = new UserMap();
		userMap.id = user.id?.Id as string;
		userMap.firstName = user.firstName;
		userMap.lastName = user.lastName;
		userMap.otherName = user.otherName;
		userMap.email = user.email;
		userMap.password = user.password;
		userMap.tokens = user.tokens.map((x) => UserTokenMap.userTokenMap(x));
		userMap.tags = user.tags.map((x) => UserTagMap.userTagMap(x));

		return userMap;
	}

	public static user(userMap: UserMap): User {
		var userId = UserId.create(userMap.id);
		const user = User.create(
			userMap.firstName,
			userMap.lastName,
			userMap.otherName,
			userMap.email,
			userMap.password,
			userId
		).data;

		if (userMap.tokens) {
			userMap.tokens.map((x) =>
				user.addOrUpdateToken(UserTokenMap.userToken(x))
			);
		}

		if (userMap.tags) {
			var tags = userMap.tags.map((x) => UserTagMap.userTag(x));
			user.manageTags(tags);
		}
		return user;
	}
}
