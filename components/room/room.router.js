import { Router } from "express";
import { roomController } from "./room.controller.js";

export const roomRouter = new Router();

roomRouter.route("/")
	.get(roomController.findAll)
	.post(roomController.addOne);

roomRouter.route("/:id")
	.get(roomController.findOneById)
	.delete(roomController.deleteOneById)
	.post(roomController.updateOneById);

roomRouter.route("/:id/send")
	.post(roomController.addMessage);

roomRouter.route("/:id/join")
	.post(roomController.addUser);

roomRouter.route("/name/:name")
	.get(roomController.findOneByName);