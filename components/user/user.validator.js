import Joi from "joi";

export const userValidator = {
	create: {
		body: Joi.object({
			name: Joi.string().min(5).required(),
			email: Joi.string().email().required(),
			birthday: Joi.string().isoDate(),
			password: Joi.string().pattern(/[a-zA-Z0-9]*/).min(5).required()
		})
	},
	update: {
		body: Joi.object({
			name: Joi.string().min(5).optional(),
			email: Joi.string().email().optional(),
			birthday: Joi.string().isoDate().optional()
		})
	}
};