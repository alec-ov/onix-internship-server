
import { ValidationError } from "express-validation";
import { StatusCodes } from "http-status-codes";

export class UnauthorizedException extends Error {
	constructor(message) {
		super(message);
		this.status = StatusCodes.UNAUTHORIZED;
	}
}

// eslint-disable-next-line no-unused-vars
export function TransformError(err, req, res, next) {
	if (err instanceof ValidationError) {
		res.status(StatusCodes.BAD_REQUEST).json({error: err});
		return;
	}
	if (err instanceof UnauthorizedException) {
		res.status(StatusCodes.UNAUTHORIZED).json({error: err});
		return;
	}
	res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: err});
}