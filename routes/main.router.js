import { Router } from "express";
import { userRouter } from "./user.router";

export const mainRouter = new Router();

mainRouter.route("/user/", userRouter);