import Joi from "joi";

import { joiIsID } from "../../core/util.js";
import { messageValidator } from "../message/message.validator.js";

export const roomValidator = {
	create: {
		body: Joi.object({
			name: Joi.string().min(3).trim().required(),
			description: Joi.string().max(150).optional(),
			owner: Joi.string().custom(joiIsID, "validate ObjectID").required()
		})
	},
	update: {
		body: Joi.object({
			name: Joi.string().min(3).trim().optional(),
			description: Joi.string().max(150).optional()
		})
	},
	removeUser: {
		body: Joi.object({
			id: Joi.string().custom( joiIsID, "validate ObjectID").required()
		})
	},
	addUser: {
		body: Joi.object({
			id: Joi.string().custom( joiIsID, "validate ObjectID").required()
		})
	},
	getMessages: {
		query: Joi.object({
			date: Joi.string().isoDate().optional()
		})
	},
	findByUser: {
		query: Joi.object({
			user: Joi.string().custom( joiIsID, "validate ObjectID").required()
		})
	},
	searchMessages: messageValidator.search,
	addMessage: messageValidator.create,
	editMessage: messageValidator.edit,
	deleteMessage: messageValidator.delete,
};