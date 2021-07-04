import { Message } from "./message.model.js";


export const messageService = {
	async send(message) {
		const msg = new Message(message);

		return msg.save();
	},
	async getAll(roomId, fromDate) {
		return Message.find({
			room: roomId,
			sent_at: { $gte: new Date(fromDate) || "2021-01-01", $lte: new Date() }
		})
			.sort({ sent_at: 1 })
			.lean();
	},
	async getOne(id) {
		return Message.findById(id).lean();
	}
};