import mongoose from "mongoose";

import { User } from "./user.model";

export const userService = {

	findOneById: async function (id) {
		return User.findById(id).lean();
	},
	findByName: async function (name) {
		return User.find({name: String(name)}).lean();
	},

	findAll: async function () {
		return User.find().lean();
	},

	createOne: async function (user) {
		const newUser = new User(user);
		return newUser.save();
	},

	deleteOneById: async function (id) {
		if (!mongoose.isValidObjectId(id)) return null;
		return User.deleteOne({_id: id});
	},

	updateOneById: async function (id, newUser) {
		if (!mongoose.isValidObjectId(id)) return null;
		const user = await User.findById(id);
		user.set(newUser);
		return user.save();
	}
};