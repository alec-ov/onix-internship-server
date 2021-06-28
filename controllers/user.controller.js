import { Catcher } from "../core/util.js";
import { StatusCodes } from "http-status-codes";
import { userService } from "../services/user.service.js";

// const list = [
// 	{ id: 1, name: "Test0", age: 20 },
// 	{ id: 2, name: "Test1", age: 30 },
// 	{ id: 3, name: "Test2", age: 40 }
// ];
export const userController = {
	findAll: Catcher(async (req, res) => {
		res.status(StatusCodes.OK);
		res.json({ status: StatusCodes.OK, message: "found", data: await userService.findAll() });
	}),
	findOneById: Catcher(async (req, res) => {
		const id = req.params.id;
		const user = await userService.findOneById(id);
		if (user) {
			res.status(StatusCodes.OK);
			res.json({ status: StatusCodes.OK, message: "found", data: user });
		}
		else {
			res.status(StatusCodes.NOT_FOUND);
			res.json({ status: StatusCodes.NOT_FOUND, message: `user #${id} not found` });
		}
	}),
	addOne: Catcher(async (req, res, next) => {
		const user = req.body;
		try {
			const result = await userService.createOne(user);
			res.status(StatusCodes.CREATED);
			res.json({ status: StatusCodes.CREATED, message: "created", data: result });
		}
		catch (e) {
			if (e.name != "ValidationError") next(e);
			res.status(StatusCodes.BAD_REQUEST);
			res.json({ status: StatusCodes.BAD_REQUEST, error: e.message });
		}
	})
};