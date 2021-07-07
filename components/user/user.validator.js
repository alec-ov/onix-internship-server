import Joi from "joi";
import { joiIsID } from "../../core/util.js";

const passwordSchema = Joi.string().trim().pattern(/[a-zA-Z0-9]*/).min(5).required();

export const userValidator = {
	create: {
		body: Joi.object({
			name: Joi.string().min(2).required(),
			fullName: Joi.string().min(2).optional(),
			email: Joi.string().email().required(),
			birthday: Joi.string().isoDate(),
			password: passwordSchema
		}),
		query: Joi.object({
			autoLogin: Joi.bool().optional()
		})
	},
	update: {
		body: Joi.object({
			name: Joi.string().min(2),
			email: Joi.string().email(),
			birthday: Joi.string().isoDate()
		})
	},
	login: {
		body: Joi.object({
			password: passwordSchema,
			id: Joi.string().custom(joiIsID, "check id"),
			email: Joi.string().email()
		}).xor("id", "email")
	}
};