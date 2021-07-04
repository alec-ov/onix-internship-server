import { Message } from "./message.model.js";


export const messageService = {
	async send(message) {
		const msg = new Message(message);

		return msg.save();
	}
}ж