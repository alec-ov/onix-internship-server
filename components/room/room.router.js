import { Router } from "express";
import { validate } from "express-validation";
import { JoiOptions, validationOptions } from "../../core/util.js";
import { userController } from "../user/user.controller.js";
import { roomController } from "./room.controller.js";
import { roomValidator } from "./room.validator.js";

export const roomRouter = new Router();

const joiValidate = (schema) => {
	return validate(schema, validationOptions, JoiOptions);
};

roomRouter.route("/")
	.get(roomController.findAll)
	.post(joiValidate(roomValidator.create), userController.middleware.checkLogin,
		roomController.middleware.checkAuthor,/**/ roomController.addOne);

roomRouter.route("/find/")
	.get(joiValidate(roomValidator.findByUser), roomController.findByUser);

roomRouter.route("/:id")
	.get(roomController.findOneById)
	.delete(userController.middleware.checkLogin, roomController.deleteOneById) // checks owner internally
	.post(joiValidate(roomValidator.update), userController.middleware.checkLogin,
		roomController.updateOneById); // checks owner internally

roomRouter.route("/:id/messages")
	.get(joiValidate(roomValidator.getMessages), roomController.getMessages);
roomRouter.route("/:id/messages/search")
	.get(joiValidate(roomValidator.searchMessages), roomController.searchMessages);

roomRouter.post("/:id/messages/send",
	joiValidate(roomValidator.addMessage), userController.middleware.checkLogin,
	roomController.middleware.checkAuthor,/**/ roomController.addMessage);
roomRouter.post("/:id/messages/edit",
	joiValidate(roomValidator.editMessage), userController.middleware.checkLogin,
	roomController.middleware.checkAuthor,/**/ roomController.editMessage);
roomRouter.post("/:id/messages/delete",
	joiValidate(roomValidator.deleteMessage), userController.middleware.checkLogin,
	roomController.middleware.checkAuthor,/**/ roomController.deleteMessage);

roomRouter.route("/:id/join")
	.post(joiValidate(roomValidator.addUser), userController.middleware.checkLogin, roomController.addUser);

roomRouter.route("/:id/leave")
	.post(joiValidate(roomValidator.removeUser), userController.middleware.checkLogin, roomController.removeUser);

roomRouter.route("/name/:name")
	.get(roomController.findOneByName);
