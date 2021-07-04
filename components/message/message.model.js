import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new mongoose.Schema({
	text: {
		type: String,
		require: true
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
});

export const Message = mongoose.model("Room", messageSchema);