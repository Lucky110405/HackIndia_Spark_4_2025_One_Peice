import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
    let error = err;

    if (err instanceof mongoose.Error.ValidationError) {
        const validationErrors = Object.values(err.errors).map(error => error.message);
        error = new ApiError(400, "Validation Failed", validationErrors);
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        error = new ApiError(409, `${field} already exists`);
    }

    if (err instanceof mongoose.Error.CastError) {
        error = new ApiError(400, "Invalid ID format");
    }

    if (err.name === "JsonWebTokenError") {
        error = new ApiError(401, "Invalid token");
    }

    if (err.name === "TokenExpiredError") {
        error = new ApiError(401, "Token has expired");
    }

    if (err.name === "MulterError") {
        error = new ApiError(400, err.message);
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    const errors = error.errors || [];

    res.status(statusCode).json({
        success: false,
        message,
        errors,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    process.exit(1);
});