import express, { json, urlencoded } from "express";
import { TransformError } from "./error.js";

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

export const addLastMiddleware = () => {
	app.use(TransformError);
};

export { app, express };