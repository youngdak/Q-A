import EnvironmentVariable from "@src/environmentVariable";
import passport from "passport";
import passportJwt from "passport-jwt";
import UserId from "@src/domain/users/userId";
import IUserRepository from "@src/application/users/interfaces/userRepository";

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

export default class PassportMiddleware {
	private readonly _userrepository: IUserRepository;
	constructor(userrepository: IUserRepository) {
		this._userrepository = userrepository;
		this.useJwt();
	}

	private useJwt(): void {
		passport.use(
			new JwtStrategy(
				{
					jwtFromRequest: ExtractJwt.fromExtractors([
						(req) => this.cookieExtractor(req),
					]),
					secretOrKey: EnvironmentVariable.SECRET_KEY,
				},
				async (token, done) => {
					try {
						const userIdAsStr = token.id;
						const userId = UserId.create(userIdAsStr);
						const user = await this._userrepository.getById(userId);
						if (!user) {
							return done("please authenticate!", null);
						}

						return done(null, user);
					} catch (error) {
						done(error);
					}
				}
			)
		);
	}

	private cookieExtractor(req: any): string {
		var token = null;
		if (req && req.cookies) {
			token = req.cookies["jwt"];
		}
		return token;
	}

	public static cookieOptions(): any {
		const options = {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
		};

		return options;
	}
}
