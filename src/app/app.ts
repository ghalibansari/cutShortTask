import bodyParser from "body-parser";
import cors from "cors";
import express, { Application } from "express";
import rateLimit from "express-rate-limit";
import { queryParser } from "./helper/QueryParser";
import { registerRoutes } from "./routes";

const limiter = rateLimit({
  windowMs: 10 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

class App {
  app: Application;

  constructor() {
    this.app = express();
    this.middleware();
    this.setupApiRoutes();
  }

  private middleware(): void {
    this.app.use(cors());
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(limiter);
    this.app.use(
      bodyParser.urlencoded({
        limit: "10mb",
        extended: true,
        parameterLimit: 50000,
      })
    );
    this.app.use(queryParser());
    this.app.enable("strict routing");
  }

  private setupApiRoutes(): void {
    registerRoutes(this.app);
  }
}

export default new App().app;
