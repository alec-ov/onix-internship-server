import mongoose from "mongoose";

const Schema = mongoose.Schema;

const chatSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	users: [{
		type: Schema.Types.ObjectId,
		ref: "User"
	}],
	messages: [{
		text: {
			type: String,
			required: true
		},
		author: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User"
		}
	}]
});

const Chat = mongoose.model("Chat", chatSchema);

export const chatService = {

	findOneById: async function (id) {
		return await Chat.findById(id).populate("users");
	},
	findByName: async function (name) {
		return await Chat.find({ name: String(name) }).populate("users");
	},

	findAll: async function () {
		return await Chat.find();
	},

	createOne: async function (chat) {
		return await Chat.create(chat);
	},

	deleteOneById: async function (id) {
		if (!mongoose.isValidObjectId(id)) return null;
		return await Chat.deleteOne({ _id: id })
	},

	updateOneById: async function (id, newChat) {
		delete newChat.messages;
		delete newChat.users;
		if (!mongoose.isValidObjectId(id)) return null;
		return await Chat.updateOne({ _id: id }, newChat, { runValidators: true });
	},
	addUser: async function (chatId, userId) {
		const chat = await Chat.findById(chatId);
		chat.users.push(userId);
		chat.save({runValidators: true});
	},
	addMessage: async function (chatId, message) {
		const chat = await Chat.findById(chatId);
		if (chat.users.includes(message.author)) {
			chat.messages.push(message);
		}
		return await chat.save({runValidators: true});
	}
};