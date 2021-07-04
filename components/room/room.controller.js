import { Catcher } from "../../core/util.js";
import { StatusCodes } from "http-status-codes";
import { roomService } from "./room.service.js";
import { messageService } from "../message/message.service.js";
import { UnauthorizedException } from "../../core/error.js";

export const roomController = {
	findAll: Catcher(async (req, res) => {
		res.status(StatusCodes.OK);
		res.json({ status: StatusCodes.OK, message: "found", data: await roomService.findAll() });
	}),
	findOneById: Catcher(async (req, res) => {
		const id = req.params.id;
		const chat = await roomService.findOneById(id);
		if (chat) {
			res.status(StatusCodes.OK);
			res.json({ status: StatusCodes.OK, message: "found", data: chat });
		}
		else {
			res.status(StatusCodes.NOT_FOUND);
			res.json({ status: StatusCodes.NOT_FOUND, message: `chat #${id} not found` });
		}
	}),
	findOneByName: Catcher(async (req, res) => {
		const name = String(req.params.name);
		const chat = await roomService.findByName(name);
		if (chat) {
			res.status(StatusCodes.OK);
			res.json({ status: StatusCodes.OK, message: "found", data: chat });
		}
		else {
			res.status(StatusCodes.NOT_FOUND);
			res.json({ status: StatusCodes.NOT_FOUND, message: `chat {name: "${name}"} not found.` });
		}
	}),
	addOne: Catcher(async (req, res, next) => {
		const chat = req.body;
		try {
			const result = await roomService.createOne(chat);
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
		const chat = await roomService.deleteOneById(id);
		if (chat) {
			res.status(StatusCodes.OK);
			res.json({ status: StatusCodes.OK, message: "deleted", data: chat });
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

		const data = await roomService.updateOneById(id, newUser);
		if (data) {
			res.status(StatusCodes.OK);
			res.json({ status: StatusCodes.OK, message: "updated", data });
			return;
		}

		res.status(StatusCodes.NOT_FOUND);
		res.json({ status: StatusCodes.NOT_FOUND, message: `updating chat #${id} failed` });

	}),

	addUser: Catcher(async (req, res) => {
		const id = req.params.id;
		const userId = req.body.id;

		const data = await roomService.addUser(id, userId);
		if (data?.nModified === 1) {
			res.status(StatusCodes.OK);
			res.json({ status: StatusCodes.OK, message: "Added user to chat" });
			return;
		}

		res.status(StatusCodes.NOT_FOUND);
		res.json({ status: StatusCodes.NOT_FOUND, message: `joining chat #${id} failed` });

	}),

	addMessage: Catcher(async (req, res) => {
		const roomId = req.params.id;
		const room = await roomService.findOneById(roomId);
		const message = req.body;
		if (!room.users.includes(message.author)) {
			throw new UnauthorizedException(`Invalid author for chat #${roomId}`);
		}
		res.send({ data: await messageService.send(message) });
	}),
	getMessages: Catcher(async (req, res) => {
		const roomId = req.params.id;
		const date = req.query.date;
		res.send({ data: await messageService.getAll(roomId, date) });
	})
};