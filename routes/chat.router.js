import { Router } from "express";
import { chatController } from "../controllers/chat.controller.js";

export const chatRouter = new Router();

chatRouter.route("/")
	.get(chatController.findAll)
	.post(chatController.addOne);

chatRouter.route("/:id")
	.get(chatController.findOneById)
	.delete(chatController.deleteOneById)
	.post(chatController.updateOneById);

chatRouter.route("/:id/send")
	.post(chatController.addMessage);

chatRouter.route("/:id/join")
	.post(chatController.addUser);

chatRouter.route("/name/:name")
	.get(chatController.findOneByName);