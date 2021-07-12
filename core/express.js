import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { TransformError } from "./error.js";


import helmet from "helmet";

const app = express();

app.use(helmet({contentSecurityPolicy: false}));
app.use(cors());

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static("static"));

export const addLastMiddleware = () => {
	app.use(TransformError);
};

export { app, express };