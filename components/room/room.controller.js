import { Catcher } from "../../core/util.js";
import { StatusCodes } from "http-status-codes";
import { roomService } from "./room.service.js";
import { messageService } from "../message/message.service.js";
import { UnauthorizedException } from "../../core/error.js";

const checkOwner = (req, chat) => {
	if (req.user) {
		if (chat.owner === req.user.id || req.user.role == "admin") {
			return true;
		}
		else {
			throw new UnauthorizedException("Incorrect premissions");
		}
	}
	else {
		throw new UnauthorizedException("Login required");
	}
};

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
	findByUser: Catcher(async (req, res) => {
		const userId = String(req.query.user);
		const chats = await roomService.findByUser(userId);
		if (chats) {
			res.status(StatusCodes.OK);
			res.json({ status: StatusCodes.OK, message: "found", data: chats });
		}
		else {
			res.status(StatusCodes.NOT_FOUND);
			res.json({ status: StatusCodes.NOT_FOUND, message: `chats for user #${userId} not found.` });
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
		const chat = await roomService.findOneById(id);
		if (chat && checkOwner(req, chat)) {
			const data = await roomService.removeOneById(id);
			res.status(StatusCodes.OK);
			res.json({ status: StatusCodes.OK, message: "deleted", data });
		}
		else {
			res.status(StatusCodes.NOT_FOUND);
			res.json({ status: StatusCodes.NOT_FOUND, message: `deleting user #${id} failed` });
		}
	}),
	updateOneById: Catcher(async (req, res) => {
		const id = req.params.id;
		const newRoom = req.body;
		delete newRoom._id;

		const room = await roomService.findOneById(id);
		if (room && checkOwner(req, room)) {
			const data = await roomService.updateOneById(id, newRoom);
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
		if (data) {
			res.status(StatusCodes.OK);
			res.json({ status: StatusCodes.OK, message: "Added user to chat" });
			return;
		}

		res.status(StatusCodes.NOT_FOUND);
		res.json({ status: StatusCodes.NOT_FOUND, message: `joining chat #${id} failed` });

	}),
	removeUser: Catcher(async (req, res) => {
		const id = req.params.id;
		const userId = req.body.id;

		const data = await roomService.removeUser(id, userId);
		if (data) {
			res.status(StatusCodes.OK);
			res.json({ status: StatusCodes.OK, message: "Removed user from chat" });
			return;
		}

		res.status(StatusCodes.NOT_FOUND);
		res.json({ status: StatusCodes.NOT_FOUND, message: `Leaving chat #${id} failed` });

	}),

	addMessage: Catcher(async (req, res) => {
		const roomId = req.params.id;
		const room = await roomService.findOneById(roomId);
		const message = req.body;
		message.room = roomId;
		if (!room.users.some((user) => user._id == message.author)) {
			throw new UnauthorizedException(`Invalid author for chat #${roomId}`);
		}
		const data = await messageService.send(message);
		
		if (data) {
			res.status(StatusCodes.CREATED).json({ status: StatusCodes.CREATED, data });
		}
		else {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ status: StatusCodes.INTERNAL_SERVER_ERROR, error: "could not send" });
		}
	}),
	getMessages: Catcher(async (req, res) => {
		const roomId = req.params.id;
		const date = req.query.date;
		res.send({ status: StatusCodes.OK, message: "found", data: await messageService.getAll(roomId, date) });
	}),
	searchMessages: Catcher(async (req, res) => {
		const roomId = req.params.id;
		//const
		res.send({ status: StatusCodes.OK, message: "found", data: await messageService.search(roomId, req.query) });
	}),

	middleware: {
		checkAuthor: (req, res, next) => {
			if (req.user) {
				if (req.body.author === req.user.id || (req.body.owner == req.user.id || req.user.role == "admin")) {
					next();
				}
				else {
					throw new UnauthorizedException("Incorrect premissions");
				}
			}
			else {
				throw new UnauthorizedException("Login required");
			}
		}
	}
};