import { Entity, Column, PrimaryColumn } from "typeorm";
import UserTag, { IUserTag } from "@src/domain/users/userTag";
import UserTagId from "@src/domain/users/userTagId";

@Entity("UserTag")
export default class UserTagMap implements IUserTag {
	@PrimaryColumn()
	id: string;

	@Column()
	createdBy: string;

	@Column()
	createdDate: Date;

	@Column({ nullable: false })
	userId: string;

	@Column({ nullable: false })
	tagId: string;

	public static userTagMap(userTag: UserTag): UserTagMap {
		const userTagMap = new UserTagMap();
		userTagMap.id = userTag.id?.Id!;
		userTagMap.userId = userTag.userId;
		userTagMap.tagId = userTag.tagId;
		userTagMap.createdBy = userTag.createdBy;
		userTagMap.createdDate = userTag.createdDate;

		return userTagMap;
	}

	public static userTag(userTagMap: UserTagMap): UserTag {
		var userTagId = UserTagId.create(userTagMap.id);
		const userTag = UserTag.create(
			userTagMap.userId,
			userTagMap.tagId,
			userTagMap.createdBy,
			userTagMap.createdDate,
			userTagId
		).data;

		return userTag;
	}
}
