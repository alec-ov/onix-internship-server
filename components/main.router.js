import { Router } from "express";
import { roomRouter } from "./room/room.router.js";
import { userRouter } from "./user/user.router.js";

export const mainRouter = new Router();

mainRouter.use("/json/user", userRouter);
mainRouter.use("/json/room", roomRouter);