import { Router } from "express";
import { validate } from "express-validation";
import { JoiOptions, validationOptions } from "../../core/util.js";
import { roomController } from "./room.controller.js";
import { roomValidator } from "./room.validator.js";

export const roomRouter = new Router();

const joiValidate = (schema) => {
	return validate(schema, validationOptions, JoiOptions);
};

roomRouter.route("/")
	.get(roomController.findAll)
	.post(joiValidate(roomValidator.create), roomController.addOne);

roomRouter.route("/:id")
	.get(roomController.findOneById)
	.delete(roomController.deleteOneById)
	.post(joiValidate(roomValidator.update), roomController.updateOneById);

roomRouter.route("/:id/send")
	.post(joiValidate(roomValidator.addMessage), roomController.addMessage);

roomRouter.route("/:id/messages")
	.get(joiValidate(roomValidator.getMessages), roomController.getMessages);
roomRouter.route("/:id/messages/search")
	.get(joiValidate(roomValidator.searchMessages), roomController.searchMessages);

roomRouter.route("/:id/join")
	.post(joiValidate(roomValidator.addUser), roomController.addUser);

roomRouter.route("/:id/leave")
	.post(joiValidate(roomValidator.removeUser), roomController.removeUser);

roomRouter.route("/name/:name")
	.get(roomController.findOneByName);