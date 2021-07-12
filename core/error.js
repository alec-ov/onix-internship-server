
import { ValidationError } from "express-validation";
import { StatusCodes } from "http-status-codes";

export class UnauthorizedException extends Error {
	constructor(message) {
		super(message);
		this.status = StatusCodes.UNAUTHORIZED;
		this.message = message;
	}
	toJSON() {
		return { message: this.message, status: this.status };
	}
}

// eslint-disable-next-line no-unused-vars
export function TransformError(err, req, res, next) {
	if (err instanceof ValidationError) {
		res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, errors: [err] });
		return;
	}
	if (err instanceof UnauthorizedException) {
		res.status(StatusCodes.UNAUTHORIZED).json({ status: StatusCodes.UNAUTHORIZED, errors: [err] });
		return;
	}
	let status = err.status ?? StatusCodes.INTERNAL_SERVER_ERROR;
	res.status(status).json({ status, errors: [err] });
}