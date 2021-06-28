import { Router } from "express";
import { userController } from "../controllers/user.controller.js";

export const userRouter = new Router();

userRouter.route("/")
	.get(userController.findAll)
	.post(userController.addOne);

userRouter.route("/:id")
	.get(userController.findOneById);