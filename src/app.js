import express from "express";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";
import friendsRoutes from "./routes/friends.routes.js";

const app = express();

// Final CORS Configuration
// In a production environment, we need to allow requests from the live frontend URL.
// We can use a conditional check to allow either the local dev URL or the production URL.
const allowedOrigins = [
  "http://localhost:5173", // For local development
  "https://taskoapp.netlify.app", // Your live Netlify URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the request origin is in our list of allowed origins.
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies to be sent
};

// Basic Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions)); // Use configured CORS middleware
app.use(helmet());

// API Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy!" });
});

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/friends", friendsRoutes);

// 404 Not Found Handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Enhanced Error Handling Middleware
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
