import * as dotenv from "dotenv";
if ((process.env.NODE_ENV || "development") == "development") {
	dotenv.config();
}

import "./core/db.js";

import { app } from "./core/express.js";
import { TStyle } from "./core/util.js";
import { mainRouter } from "./routes/main.router.js";

const PID = process.pid;
const PORT = Number(process.env.PORT ?? 3000);

console.log(TStyle.t("Starting server. PID:", TStyle.Bright), PID);

app.use(mainRouter);

app.listen(PORT, () => {
	console.log(TStyle.t("Listening on port:", TStyle.Success), PORT);
});