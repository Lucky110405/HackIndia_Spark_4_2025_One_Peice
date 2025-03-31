import express from "express";
import { corsConfig } from "./config/cors.config.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import realEstateRouter from "./routes/realestate.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import financialRouter from "./routes/financial.routes.js";


const app = express();

// Middleware configurations
app.use(corsConfig); 

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/real-estate", realEstateRouter);
app.use("/api/v1/financial", financialRouter);

// Health check route
app.get("/health", (_, res) => {
    res.status(200).json({
        status: "active",
        message: "Server is running"
    });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((_, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

export { app };