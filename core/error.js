
import { ValidationError } from "express-validation";
import { StatusCodes } from "http-status-codes";

// eslint-disable-next-line no-unused-vars
export function TransformError(err, req, res, next) {
	if (err instanceof ValidationError) {
		res.status(StatusCodes.BAD_REQUEST).json({error: err});
		return;
	}
	res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: err});
}