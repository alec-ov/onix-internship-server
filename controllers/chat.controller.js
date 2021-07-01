import { Catcher } from "../core/util.js";
import { StatusCodes } from "http-status-codes";
import { chatService } from "../services/chat.service.js";

export const chatController = {
	findAll: Catcher(async (req, res) => {
		res.status(StatusCodes.OK);
		res.json({ status: StatusCodes.OK, message: "found", data: await chatService.findAll() });
	}),
	findOneById: Catcher(async (req, res) => {
		const id = req.params.id;
		const chat = await chatService.findOneById(id);
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
		const chat = await chatService.findByName(name);
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
			const result = await chatService.createOne(chat);
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
		const chat = await chatService.deleteOneById(id);
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

		const data = await chatService.updateOneById(id, newUser);
		if (data?.nModified === 1) {
			res.status(StatusCodes.OK);
			res.json({ status: StatusCodes.OK, message: "updated" });
			return;
		}
		
		res.status(StatusCodes.NOT_FOUND);
		res.json({ status: StatusCodes.NOT_FOUND, message: `updating chat #${id} failed` });
		
	}),

	addMessage: Catcher(async (req, res) => {
		const id = req.params.id;
		const message = req.body;

		const data = await chatService.addMessage(id, message);
		if (data?.nModified === 1) {
			res.status(StatusCodes.OK);
			res.json({ status: StatusCodes.OK, message: "sent" });
			return;
		}
		
		res.status(StatusCodes.NOT_FOUND);
		res.json({ status: StatusCodes.NOT_FOUND, message: `sending chat #${id} failed` });
		
	}),
	addUser: Catcher(async (req, res) => {
		const id = req.params.id;
		const userId = req.body.id;

		const data = await chatService.addUser(id, userId);
		if (data?.nModified === 1) {
			res.status(StatusCodes.OK);
			res.json({ status: StatusCodes.OK, message: "Added user to chat" });
			return;
		}
		
		res.status(StatusCodes.NOT_FOUND);
		res.json({ status: StatusCodes.NOT_FOUND, message: `joining chat #${id} failed` });
		
	})
};