import { Router } from "express";
import { validate } from "express-validation";
import { userController } from "./user.controller.js";
import { JoiOptions, validationOptions } from "../../core/util.js";
import { userValidator } from "./user.validator.js";

export const userRouter = new Router();

userRouter.route("/")
	.get(userController.findAll)
	.post(validate(userValidator.create, validationOptions, JoiOptions), userController.addOne);

userRouter.route("/:id")
	.get(userController.findOneById)
	.delete(userController.deleteOneById)
	.post(validate(userValidator.update, validationOptions, JoiOptions), userController.updateOneById);

userRouter.route("/name/:name")
	.get(userController.findOneByName);