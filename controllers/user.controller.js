import { Catcher } from "../core/util.js";
import { StatusCodes } from "http-status-codes";

const list = [
	{ id: 1, name: "Test0", age: 20 },
	{ id: 2, name: "Test1", age: 30 },
	{ id: 3, name: "Test2", age: 40 }
];
export const userController = {
	findAll: Catcher(async (req, res) => {
		res.status(StatusCodes.OK);
		res.json({ status: StatusCodes.OK, message: "found", data: list });
	}),
	findOne: Catcher(async (req, res) => {
		const id = Number(req.params.id);
		const user = list.find((el) => el.id === id);
		if (user) {
			res.status(StatusCodes.OK);
			res.json({ status: StatusCodes.OK, message: "found", data: user });
		}
		else {

			res.status(StatusCodes.NOT_FOUND);
			res.json({ status: StatusCodes.NOT_FOUND, message: `user #${id} not found` });
		}
	}),
	addOne: Catcher(async (req, res) => {
		const user = req.body;
		if (user.name && !Number.isNaN(Number(user.age)) && user.id == undefined) {
			const newUser = {
				id: (list[list.length - 1].id || 0) + 1,
				name: user.name,
				age: user.age
			};
			list.push(newUser);
			res.status(StatusCodes.CREATED);
			res.json({ status: StatusCodes.CREATED, message: "created", data: newUser });
		}
		else {
			res.status(StatusCodes.BAD_REQUEST);
			res.json({ status: StatusCodes.BAD_REQUEST, message: "expected user to be {name: string, age: number}" });
		}
	})
};