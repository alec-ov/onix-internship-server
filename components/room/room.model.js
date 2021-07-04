import mongoose from "mongoose";

const Schema = mongoose.Schema;

const roomSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	users: [{
		type: Schema.Types.ObjectId,
		ref: "User"
	}],
	messages: [{
		type: Schema.Types.ObjectId,
		ref: "Message"
	}]
});

export const Room = mongoose.model("Room", roomSchema);