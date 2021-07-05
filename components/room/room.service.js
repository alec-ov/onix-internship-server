import mongoose from "mongoose";
import { Room } from "./room.model.js";

export const roomService = {

	findOneById: async function (id) {
		return Room
			.findById(id)
			.populate("users")
			.populate("owner")
			.lean();
	},
	findByName: async function (name) {
		return Room
			.find({ name: String(name) })
			.populate("users")
			.populate("owner")
			.lean();
	},

	findAll: async function () {
		return Room.find().populate("owner").lean();
	},

	createOne: async function (chat) {
		const newChat = new Room(chat);
		return newChat.save();
	},

	deleteOneById: async function (id) {
		if (!mongoose.isValidObjectId(id)) return null;
		return Room.deleteOne({ _id: id });
	},

	updateOneById: async function (id, newChat) {
		delete newChat.messages;
		delete newChat.users;
		if (!mongoose.isValidObjectId(id)) return null;
		const chat = await Room.findById(id);
		return chat.set(newChat).save();
	},
	addUser: async function (chatId, userId) {
		const chat = await Room.findById(chatId);
		chat.users.push(userId);
		return chat.save();
	},
	removeUser: async function (chatId, userId) {
		const chat = await Room.findById(chatId);
		chat.users.splice(chat.users.findIndex((id) => id === userId), 1);
		return chat.save();
	}
};