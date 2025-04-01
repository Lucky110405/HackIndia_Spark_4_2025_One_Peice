import {User} from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';

export const userService = {
    async createUser(userData) {
        const existingUser = await User.findOne({
            $or: [
                { email: userData.email },
                { aadhaarNumber: userData.aadhaarNumber },
                { panNumber: userData.panNumber }
            ]
        });

        if (existingUser) {
            throw new ApiError(409, "User already exists");
        }

        const user = await User.create(userData);
        return user;
    },

    async getUserById(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        return user;
    },

    async updateUser(userId, updateData) {
        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        return user;
    }
};