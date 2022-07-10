import express, { json } from "express";
import "express-async-errors";
import dotenv from "dotenv";
import router from "./routes/router.js";
import errorHandler from "./middlewares/errorHandlerMiddleware.js"
import chalk from "chalk";
dotenv.config();

const app = express();
app.use(json());

app.use(router);
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(chalk.yellow(`server on port ${port}`)));