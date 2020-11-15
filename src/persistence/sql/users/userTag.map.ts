import { Entity, Column, PrimaryColumn, ManyToOne } from "typeorm";
import UserTag, { IUserTag } from "../../../domain/users/userTag";
import UserTagId from "../../../domain/users/userTagId";
import UserMap from "./user.map";

@Entity("Tag")
export default class UserTagMap implements IUserTag {
	@PrimaryColumn()
	id: string;

	@Column()
	name: string;

	@ManyToOne((type) => UserMap, (userMap) => userMap.tags, {
		cascade: true,
		nullable: false,
	})
	user: UserMap;

	public static userTagMap(userTag: UserTag): UserTagMap {
		const userTagMap = new UserTagMap();
		userTagMap.id = userTag.id?.Id as string;
		userTagMap.name = userTag.name;

		return userTagMap;
	}

	public static userTag(userTagMap: UserTagMap): UserTag {
		var userTagId = UserTagId.create(userTagMap.id);
		const userTag = UserTag.create(userTagMap.name, userTagId).data;
		return userTag;
	}
}
