import Joi from "joi";
import { joiIsID } from "../../core/util.js";

export const messageValidator = {
	create: {
		body: Joi.object({
			text: Joi.string().min(1),
			author: Joi.string().custom(joiIsID, "ckeck ID").required(),
			//room: Joi.string().custom(joiIsID, "ckeck ID").required(),
			forwardOf: Joi.string().custom(joiIsID, "ckeck ID")
		})
			.or("forwardOf", "text")
		// A message is plain text; 
		// plain forward of another message; 
		// or a reply(both fields defined)
		,
		params: Joi.object({
			id: Joi.string().custom(joiIsID, "ckeck ID").required() /** roomId */
		})
	},
	edit: {
		body: Joi.object({
			id: Joi.string().custom(joiIsID, "ckeck ID").required(),
			author: Joi.string().custom(joiIsID, "ckeck ID").required(),
			text: Joi.string().min(1).required()
		}),
		params: Joi.object({
			id: Joi.string().custom(joiIsID, "ckeck ID").required() /** roomId */
		})
	},
	delete: {
		body: Joi.object({
			id: Joi.string().custom(joiIsID, "ckeck ID").required(),
			author: Joi.string().custom(joiIsID, "ckeck ID").required(),
		}),
		params: Joi.object({
			id: Joi.string().custom(joiIsID, "ckeck ID").required() /** roomId */
		})
	},
	search: {
		query: Joi.object({
			text: Joi.string(),
			author: Joi.string().custom(joiIsID, "ckeck ID"),
			fromDate: Joi.string().isoDate(),
			toDate: Joi.string().isoDate()
		}
		).or("text", "author", "fromDate", "toDate")
	}
};