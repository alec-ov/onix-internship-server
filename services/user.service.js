import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	age: {
		type: Number,
		required: true
	}
});

const User = mongoose.model("User", userSchema);

export const userService = {

	findOneById: async function (id) {
		return await User.findById(id);
	},

	findAll: async function () {
		return await User.find();
	},

	createOne: async function (user) {
		return await User.create(user);
	}
};