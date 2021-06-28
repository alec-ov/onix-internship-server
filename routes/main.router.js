import { Router } from "express";
import { userRouter } from "./user.router.js";

export const mainRouter = new Router();

mainRouter.use("/json/user", userRouter);