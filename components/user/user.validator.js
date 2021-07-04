import Joi from "joi";

export const userValidator = {
	create: {
		body: Joi.object({
			name: Joi.string().min(5).required(),
			email: Joi.string().email().required(),
			birthday: Joi.string().isoDate().required()
		})
	},
	update: {
		body: Joi.object({
			name: Joi.string().min(5).required(),
			email: Joi.string().email().required()
		})
	}
};