import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		require: true
	},
	email: {
		type: String,
		trim: true,
		require: true
	},
	password: {
		type: String,
		require: true
	},
	birthday: {
		type: mongoose.Schema.Types.Date,
		require: false,
		default: null
	}
});

export const User = mongoose.model("User", userSchema);