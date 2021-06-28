import * as dotenv from "dotenv";
dotenv.config();

import { app } from "./core/express";
import { mainRouter } from "./routes/main.router";

const PID = process.pid;
const PORT = process.env.PORT ?? 3000;

console.log("Starting server. PID:", PID);

app.use(mainRouter);

app.listen(PORT, () => {
	console.log("Listening on port", PORT);
});