import express from "express";
const app = express();
import http from "http";
const server = http.createServer(app);

import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/routers";
import ErrorHandler from "./helpers/errorHandler";

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", routes);

app.use(ErrorHandler.errorLogger);

app.use(ErrorHandler.errorResponder);

server.listen(3001, () => {
  console.log("listening on *:3001");
});


exports = { app };
