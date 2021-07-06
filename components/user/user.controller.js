import { Catcher } from "../../core/util.js";
import { StatusCodes } from "http-status-codes";
import { userService } from "./user.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UnauthorizedException } from "../../core/error.js";

export const userController = {
	findAll: Catcher(async (req, res) => {
		res.status(StatusCodes.OK);
		res.json({ status: StatusCodes.OK, message: "found", data: await userService.findAll() });
	}),
	findOneById: Catcher(async (req, res) => {
		const id = req.params.id;
		const user = await userService.findOneById(id);
		if (user) {
			res.status(StatusCodes.OK);
			res.json({ status: StatusCodes.OK, message: "found", data: user });
		}
		else {
			res.status(StatusCodes.NOT_FOUND);
			res.json({ status: StatusCodes.NOT_FOUND, message: `user #${id} not found` });
		}
	}),
	findOneByName: Catcher(async (req, res) => {
		const name = String(req.params.name);
		const user = await userService.findByName(name);
		if (user) {
			res.status(StatusCodes.OK);
			res.json({ status: StatusCodes.OK, message: "found", data: user });
		}
		else {
			res.status(StatusCodes.NOT_FOUND);
			res.json({ status: StatusCodes.NOT_FOUND, message: `user {name: "${name}"} not found.` });
		}
	}),
	addOne: Catcher(async (req, res, next) => {
		const user = req.body;
		user.password = await bcrypt.hash(user.password, 12);
		try {
			const result = await userService.createOne(user);
			if (req.query.autoLogin) {
				//req.redirect("/login");
				next();
				return;
			}
			res.status(StatusCodes.CREATED);
			res.json({ status: StatusCodes.CREATED, message: "created", data: result });
		}
		catch (e) {
			if (e.name != "ValidationError") next(e);
			res.status(StatusCodes.BAD_REQUEST);
			res.json({ status: StatusCodes.BAD_REQUEST, error: e.message });
		}
	}),
	deleteOneById: Catcher(async (req, res) => {
		const id = req.params.id;
		const user = await userService.deleteOneById(id);
		if (user) {
			res.status(StatusCodes.OK);
			res.json({ status: StatusCodes.OK, message: "deleted", data: user });
		}
		else {
			res.status(StatusCodes.NOT_FOUND);
			res.json({ status: StatusCodes.NOT_FOUND, message: `deleting user #${id} failed` });
		}
	}),
	updateOneById: Catcher(async (req, res) => {
		const id = req.params.id;
		const newUser = req.body;
		delete newUser._id;

		const data = await userService.updateOneById(id, newUser);
		console.log(data);
		if (data) {
			res.status(StatusCodes.OK);
			res.json({ status: StatusCodes.OK, message: "updated", data });
			return;
		}

		res.status(StatusCodes.NOT_FOUND);
		res.json({ status: StatusCodes.NOT_FOUND, message: `updating user #${id} failed` });

	}),
	/**
	 * checks the password and issues a JWT token if login is succesful
	 * @param {Request} req 
	 * @param {Response} res 
	 */
	login: Catcher(async (req, res) => {
		const { password } = req.body;
		let user = {};
		if (req.body.id) {
			user = await userService.findOneById(req.body.id);
		}
		else {
			user = await userService.findByEmail(req.body.email);
		}

		if (await bcrypt.compare(password, user.password) === true) {
			user.password = "";
			const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1d" });
			res.cookie("userToken", token, { maxAge: 1000 * 60 * 60 * 24 });
			res.cookie("user", JSON.stringify(user), { maxAge: 1000 * 60 * 60 * 24 });
			res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: "logged in", data: user });
		}
		else {
			throw new UnauthorizedException("Failed to log in");
		}
	}),
	logout: Catcher(async (req, res) => {
		res.cookie("userToken", "", { maxAge: 1 });
		res.cookie("user", "", { maxAge: 1 });
		res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: "logged out" });
	}),
	middleware: {
		/**
		 * Allows the request to preceed only if the user is logged in
		 * @param {Request} req 
		 * @param {Response} res 
		 */
		checkLogin: Catcher(async (req, res, next) => {
			try {
				const token = jwt.verify(req.cookies.userToken, process.env.JWT_SECRET);
				req.user = token;
			}
			catch (e) {
				if (e instanceof jwt.JsonWebTokenError) {
					throw new UnauthorizedException("Login required");
				}
				throw e;
			}
			next();
		}),
		onlyFor(...roles) {
			return Catcher(async (req, res, next) => {
				if (req.user) {

					if (roles.includes(req.user.role) ||
						(roles.includes("self") && (req.body.id == req.user.id || req.params.id == req.user.id))
					) {
						next();
					}
					else {
						throw new UnauthorizedException("Incorrect premissions");
					}
				}
				else {
					throw new UnauthorizedException("Login required");
				}
				next();
			});
		},
	}
};