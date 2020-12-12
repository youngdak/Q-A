import { Request, Response } from "express";
export default interface CustomContext {
	req: Request;
	res: Response;
}
