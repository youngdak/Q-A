import User, { IUser } from "@src/domain/users/user";
import { Entity, Column, PrimaryColumn } from "typeorm";
import UserId from "@src/domain/users/userId";

@Entity("User")
export default class UserMap implements IUser {
	@PrimaryColumn()
	id: string;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column({ nullable: true })
	otherName?: string;

	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@Column()
	createdBy: string;

	@Column()
	createdDate: Date;

	public static userMap(user: User): UserMap {
		const userMap = new UserMap();
		userMap.id = user.id?.Id as string;
		userMap.firstName = user.firstName;
		userMap.lastName = user.lastName;
		userMap.otherName = user.otherName;
		userMap.email = user.email;
		userMap.password = user.password;
		userMap.createdBy = user.createdBy;
		userMap.createdDate = user.createdDate;

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
			userMap.createdBy,
			userMap.createdDate,
			userId
		).data;

		return user;
	}
}
