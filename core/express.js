import express, { json, urlencoded } from "express";
import { TransformError } from "./error.js";

import helmet from "helmet";

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(helmet());

export const addLastMiddleware = () => {
	app.use(TransformError);
};

export { app, express };