import { Request, Response, NextFunction } from "express";
import { injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import passport from "passport";
import { MiddlewareInterface, NextFn, ResolverData } from "type-graphql";
import CustomContext from "@src/application/auth/provider/context";

@injectable()
export default class AuthMiddleware
	extends BaseMiddleware
	implements MiddlewareInterface<CustomContext> {
	public async handler(req: Request, res: Response, next: NextFunction) {
		await this.verify(req, res, next);
		return next();
	}

	public async use({ context }: ResolverData<CustomContext>, next: NextFn) {
		await this.verify(context.req, context.res, next);
		return next();
	}

	private verify(
		req: Request,
		res: Response,
		next: NextFn | NextFunction
	): Promise<void> {
		return new Promise<void>((resolve) => {
			passport.authenticate("jwt", { session: false }, function (err, user) {
				if (err) {
					res.status(401).send({ error: "please authenticate!" });
				}

				if (!user) {
					res.status(401).send({ error: "please authenticate!" });
				}

				if (user) {
					req.user = user;
					resolve();
				}
			})(req, res, next);
		});
	}
}
