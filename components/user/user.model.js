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
	birthday: {
		type: mongoose.Schema.Types.Date,
		require: true,
	}
});

export const User = mongoose.model("User", userSchema);