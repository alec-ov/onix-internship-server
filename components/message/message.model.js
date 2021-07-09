import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new mongoose.Schema({
	text: {
		type: String,
		require: false,
		default: ""
	},
	author: {
		type: Schema.Types.ObjectId,
		require: true,
		ref: "User"
	},
	room: {
		type: Schema.Types.ObjectId,
		require: true,
		ref: "Room"
	},
	forwardOf: {
		type: Schema.Types.ObjectId,
		require: false,
		default: null,
		ref: "Message"
	}
}, { timestamps: { createdAt: "sent_at", updatedAt: "edited_at" } });
messageSchema.index({text: "text"});

export const Message = mongoose.model("Message", messageSchema);