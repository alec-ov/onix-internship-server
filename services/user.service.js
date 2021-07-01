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
	findByName: async function (name) {
		return await User.find({name: String(name)});
	},

	findAll: async function () {
		return await User.find();
	},

	createOne: async function (user) {
		return await User.create(user);
	},

	deleteOneById: async function (id) {
		if (!mongoose.isValidObjectId(id)) return null;
		return await User.deleteOne({_id: id})
		
	},

	updateOneById: async function (id, newUser) {
		if (!mongoose.isValidObjectId(id)) return null;
		return await User.updateOne({_id: id}, newUser, {runValidators: true});
	}
};