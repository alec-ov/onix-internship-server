import { Catcher } from "../core/util.js";
import { StatusCodes } from "http-status-codes";
import { userService } from "../services/user.service.js";

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
	findOneByName: Catcher(async (req, res) => {
		const name = String(req.params.name);
		const user = await userService.findByName(name);
		if (user) {
			res.status(StatusCodes.OK);
			res.json({ status: StatusCodes.OK, message: "found", data: user });
		}
		else {
			res.status(StatusCodes.NOT_FOUND);
			res.json({ status: StatusCodes.NOT_FOUND, message: `user {name: "${name}"} not found.` });
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
	}),
	deleteOneById: Catcher(async (req, res) => {
		const id = req.params.id;
		const user = await userService.deleteOneById(id);
		if (user) {
			res.status(StatusCodes.OK);
			res.json({ status: StatusCodes.OK, message: "deleted", data: user });
		}
		else {
			res.status(StatusCodes.NOT_FOUND);
			res.json({ status: StatusCodes.NOT_FOUND, message: `deleting user #${id} failed` });
		}
	}),
	updateOneById: Catcher(async (req, res) => {
		const id = req.params.id;
		const newUser = req.body;
		delete newUser._id;

		const data = await userService.updateOneById(id, newUser);
		if (data?.nModified === 1) {
			res.status(StatusCodes.OK);
			res.json({ status: StatusCodes.OK, message: "updated" });
			return;
		}
		
		res.status(StatusCodes.NOT_FOUND);
		res.json({ status: StatusCodes.NOT_FOUND, message: `updating user #${id} failed` });
		
	})
};