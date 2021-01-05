import StringIdentity from "@src/domain/entitybase/stringIdentity";

export default class TagId extends StringIdentity {
	private constructor() {
		super();
	}

	public get Id(): string | undefined {
		return this.id;
	}

	public static create(id?: string): TagId {
		const newUser = new TagId();
		if (id != undefined) {
			newUser.id = id;
		}

		return newUser;
	}
}
