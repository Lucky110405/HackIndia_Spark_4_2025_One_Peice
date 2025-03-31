import { userService } from '../services/user.service.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const userController = {
    async registerUser(req, res) {
        try {
            const user = await userService.createUser(req.body);
            return res.status(201).json(
                new ApiResponse(201, user, "User registered successfully")
            );
        } catch (error) {
            throw new ApiError(400, error?.message || "Error in user registration");
        }
    },

    async loginUser(req, res) {
        try {
            const { email, password } = req.body;
        } catch (error) {
            throw new ApiError(400, error?.message || "Login failed");
        }
    },

    async getUserProfile(req, res) {
        try {
            const user = await userService.getUserById(req.user._id);
            return res.status(200).json(
                new ApiResponse(200, user, "Profile fetched successfully")
            );
        } catch (error) {
            throw new ApiError(400, error?.message || "Error fetching profile");
        }
    },

    async updateUser(req, res) {
        try {
            const user = await userService.updateUser(req.user._id, req.body);
            return res.status(200).json(
                new ApiResponse(200, user, "Profile updated successfully")
            );
        } catch (error) {
            throw new ApiError(400, error?.message || "Error updating profile");
        }
    },

    async getUserAssets(req, res) {
        try {
            return res.status(200).json(
                new ApiResponse(200, [], "Assets fetched successfully")
            );
        } catch (error) {
            throw new ApiError(400, error?.message || "Error fetching assets");
        }
    },

    async verifyWalletAddress(req, res) {
        try {
            const { walletAddress } = req.body;
            const user = await userService.updateUser(req.user._id, { walletAddress });
            return res.status(200).json(
                new ApiResponse(200, user, "Wallet address verified successfully")
            );
        } catch (error) {
            throw new ApiError(400, error?.message || "Error verifying wallet");
        }
    }
};