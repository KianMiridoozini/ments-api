import express, { Application, Request, Response } from "express";
import dotenvFlow from "dotenv-flow";
import { testConnectionToDatabase } from "./Repository/database";
import routes from "./routes";

dotenvFlow.config();

// create express app
const app: Application = express();

/**
 *
 */

export function startServer() {
  // JSON body parser
  app.use(express.json());
  // bind routes to the app
  app.use("/api", routes);

  testConnectionToDatabase();
  // test connection to database

  const PORT: number = parseInt(process.env.PORT as string) || 4000;
  app.listen(PORT, function () {
    console.log("Express server listening on port:" + PORT);
  });
}
