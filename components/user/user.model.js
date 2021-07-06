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
		require: true,
		unique: true
	},
	password: {
		type: String,
		require: true
	},
	birthday: {
		type: mongoose.Schema.Types.Date,
		require: false,
		default: null
	},
	role: {
		type: String,
		require: false,
		default: "user",
		enum: ["user", "admin"]
	}
});

export const User = mongoose.model("User", userSchema);