import { Entity, Column, PrimaryColumn, ManyToOne } from "typeorm";
import UserToken, { IUserToken } from "../../../domain/users/userToken";
import UserTokenId from "../../../domain/users/userTokenId";
import UserMap from "./user.map";

@Entity("Token")
export default class UserTokenMap implements IUserToken {
	@PrimaryColumn()
	id: string;

	@Column()
	token: string;

	@Column({ unique: true })
	device: string;

	@Column()
	refreshToken: string;

	@ManyToOne((type) => UserMap, (userMap) => userMap.tokens, {
		cascade: true,
		nullable: false,
	})
	user: UserMap;

	public static userTokenMap(userToken: UserToken): UserTokenMap {
		const userTokenMap = new UserTokenMap();
		userTokenMap.id = userToken.id?.Id as string;
		userTokenMap.token = userToken.token;
		userTokenMap.refreshToken = userToken.refreshToken;
		userTokenMap.device = userToken.device;

		return userTokenMap;
	}

	public static userToken(userTokenMap: UserTokenMap): UserToken {
		var userTokenId = UserTokenId.create(userTokenMap.id);
		const userToken = UserToken.create(
			userTokenMap.token,
			userTokenMap.refreshToken,
			userTokenMap.device,
			userTokenId
		).data;
		return userToken;
	}
}
