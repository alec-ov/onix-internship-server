import mongoose from "mongoose";

const Schema = mongoose.Schema;

const roomSchema = new mongoose.Schema({
	name: {
		type: String,
		require: true,
		trim: true
	},
	description: {
		type: String,
		require: false,
		trim: true,
		default: ""
	},
	users: [{
		type: Schema.Types.ObjectId,
		ref: "User"
	}],
	owner: {
		type: Schema.Types.ObjectId,
		ref: "User",
		require: true
	},
	// messages: [{
	// 	type: Schema.Types.ObjectId,
	// 	ref: "Message"
	// }]
});

export const Room = mongoose.model("Room", roomSchema);