import StringIdentity from "@src/domain/entitybase/stringIdentity";

export default class UserTagId extends StringIdentity {
	private constructor() {
		super();
	}

	public get Id(): string | undefined {
		return this.id;
	}

	public static create(id?: string): UserTagId {
		const newUser = new UserTagId();
		if (id != undefined) {
			newUser.id = id;
		}

		return newUser;
	}
}
