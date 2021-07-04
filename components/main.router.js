import { Router } from "express";
import { chatRouter } from "./chat.router.js";
import { userRouter } from "./user.router.js";

export const mainRouter = new Router();

mainRouter.use("/json/user", userRouter);
mainRouter.use("/json/chat", chatRouter);