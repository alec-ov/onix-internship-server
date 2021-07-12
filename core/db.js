import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { TStyle } from "./util.js";

if ((process.env.NODE_ENV || "development") == "development" && !process.env.DB_PASSWORD) {
	dotenv.config();
}

const dbUrl = process.env.DB_URI;

function Connect() {
	console.log(TStyle.t("Connecting to MongoDB...", TStyle.Bright));
	mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }).catch((err) => {
		console.error(TStyle.Error+"connection error:", err, TStyle.Reset);
	});
}

Connect();
const db = mongoose.connection;

db.on("disconnected", () => {
	console.log(TStyle.t("MongoDB connection lost! Retrying...", TStyle.Warning));
	Connect();
});
db.on("connected", () => {
	console.log(TStyle.t("MongoDB connected.", TStyle.Success));
});