import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import config from "./app/config";
import { AuthRoutes } from "./app/modules/auth/auth.routes";
import { UserRoutes } from "./app/modules/user/user.route";
import { FileRoutes } from "./app/modules/file/file.route";
import { SubscriptionRoutes } from "./app/modules/subscription/subscription.route";
import { FolderRoutes } from "./app/modules/folder/folder.route";

const app: Application = express();

// parsers
app.use(
  cors({
    origin: [config.client as string, config.local_client as string],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", AuthRoutes);
app.use("/users", UserRoutes);
app.use("/subscriptions", SubscriptionRoutes);
app.use("/folders", FolderRoutes);
app.use("/files", FileRoutes);

// all routes here
app.get("/", (_req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Server Status</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f4f4f4;
          font-family: Arial, sans-serif;
        }
        h1 {
          text-align: center;
          color: #333;
        }
      </style>
    </head>
    <body>
      <h1>🚀 Server is running successfully! 🚀</h1>
    </body>
    </html>
  `);
});

// not found route
app.use(notFound);

// global error handler
app.use(globalErrorHandler);

export default app;
