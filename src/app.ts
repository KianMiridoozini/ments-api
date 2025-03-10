import express, { Application } from "express";
import cors from "cors";
import dotenvFlow from "dotenv-flow";
import { testConnectionToDatabase } from "./repository/database";
import routes from "./routes";
import { setupDocs } from "./util/documentation";

dotenvFlow.config();

// create express app
const app: Application = express();

export function setupCors() {

    app.use(
        cors({
            origin: "*", // Allow requests from any origin
            methods: 'GET,HEAD,PUT,OPTIONS,PATCH,POST,DELETE',
            allowedHeaders: ['auth-token', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept'], // Allow specific headers
            credentials: true, // Allow sending cookies
        })
    );
    /*
        app.options('*', (req: Request, res: Response) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,OPTIONS,PATCH,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'auth-token, Origin, X-Requested-With, Content-Type, Accept');
            // test for credentials
            res.header('Access-Control-Allow-Credentials', 'true');
            res.sendStatus(200);
        });
        */
}

/**
 *
 */

export function startServer() {
  setupCors();

  // JSON body parser
  app.use(express.json());
  // bind routes to the app
  app.use("/api", routes);

  // setup swagger documentation
  setupDocs(app);

  testConnectionToDatabase();
  // test connection to database

  const PORT: number = parseInt(process.env.PORT as string) || 4000;
  app.listen(PORT, function () {
    console.log("Express server listening on port:" + PORT);
  });
}

