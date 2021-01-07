export default class Guard {
	public static isNotNullOrEmpty(value: string): boolean {
		return value == undefined || value == null || value.length <= 0;
	}

	public static isNotNullEmptyOrWhitespace(value: string): boolean {
		return (
			value == undefined ||
			value == null ||
			value.length <= 0 ||
			value.trim().length == 0
		);
	}
}

export class GuardMessage {
	public static isNotNullOrEmpty(propName: string): string {
		return `${propName} should not be null or empty`;
	}

	public static isNotNullEmptyOrWhitespace(propName: string): string {
		return `${propName} should not be null, empty or whitespace`;
	}
}
