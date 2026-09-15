import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";

import authRoutes from "./routes/authRoutes";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import oauthRoutes from "./routes/oauthRoutes";
import userRoutes from "./routes/userRoutes";
import notificationRoutes from "./routes/notificationRoutes";

import "./config/passport";

import { errorHandler } from "./middleware/errorMiddleware";

const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(passport.initialize());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Project Management API Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/oauth", oauthRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use(
  "/api/notifications",
  notificationRoutes
);  

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler must be last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const cleanupNotifications =
  async () => {
    try {
      const {
        deleteExpiredNotifications,
      } = await import(
        "./services/notificationService"
      );

      await deleteExpiredNotifications();
    } catch (error) {
      console.error(
        "Notification cleanup failed:",
        error
      );
    }
  };
const runDeadlineNotificationCheck =
  async () => {
    try {
      const users =
        await import(
          "./services/userService"
        ).then((module) =>
          module.getAllUserIds()
        );

      const {
        generateDeadlineNotifications,
      } = await import(
        "./services/notificationService"
      );

      for (const user of users) {
        await generateDeadlineNotifications(
          user.id
        );
      }
    } catch (error) {
      console.error(
        "Deadline notification check failed:",
        error
      );
    }
  };

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );

void cleanupNotifications();
void runDeadlineNotificationCheck();
setInterval(
  () => {
    void cleanupNotifications();
    void runDeadlineNotificationCheck();
  },
  15 * 60 * 1000
);
});