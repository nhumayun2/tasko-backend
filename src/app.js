import express from "express";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js"; // Import task routes

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy!" });
});

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes); // Mount task routes at /api/tasks

app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  if (res.statusCode === 400 && err.errors) {
    return res.json(err);
  }

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

export default app;
