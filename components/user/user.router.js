import { Router } from "express";
import { validate } from "express-validation";
import { userController } from "./user.controller.js";
import { JoiOptions, validationOptions } from "../../core/util.js";
import { userValidator } from "./user.validator.js";

const joiValidate = (schema) => {
	return validate(schema, validationOptions, JoiOptions);
};

export const userRouter = new Router();

userRouter.route("/")
	.get(userController.findAll)
	.post(joiValidate(userValidator.create), userController.addOne, userController.login);

userRouter.route("/login")
	.post(joiValidate(userValidator.login), userController.login);
userRouter.route("/logout")
	.get(userController.logout);

userRouter.route("/:id")
	.get(userController.findOneById)
	.delete(userController.middleware.onlyFor("self", "admin"), userController.deleteOneById)
	.post(joiValidate(userValidator.update), userController.middleware.onlyFor("self", "admin"), userController.updateOneById);

userRouter.route("/name/:name")
	.get(userController.findOneByName);