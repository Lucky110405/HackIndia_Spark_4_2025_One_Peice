import mongoose, { Schema } from "mongoose";
import validator from "validator";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        maxLength: [50, "First name should not exceed 50 characters"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        maxLength: [50, "Last name should not exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: "Please provide a valid email"
        }
    },
    dateOfBirth: {
        type: Date,
        required: [true, "Date of birth is required"],
        validate: {
            validator: function(value) {
                return value <= new Date();
            },
            message: "Date of birth cannot be in the future"
        }
    },
    aadhaarNumber: {
        type: String,
        required: [true, "Aadhaar number is required"],
        unique: true,
        validate: {
            validator: function(value) {
                return /^\d{12}$/.test(value);
            },
            message: "Please provide a valid 12-digit Aadhaar number"
        }
    },
    panNumber: {
        type: String,
        required: [true, "PAN number is required"],
        unique: true,
        uppercase: true,
        validate: {
            validator: function(value) {
                return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
            },
            message: "Please provide a valid PAN number"
        }
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
        validate: {
            validator: function(value) {
                return /^[6-9]\d{9}$/.test(value);
            },
            message: "Please provide a valid 10-digit phone number"
        }
    },
    address: {
        street: {
            type: String,
            required: [true, "Street address is required"],
            trim: true
        },
        city: {
            type: String,
            required: [true, "City is required"],
            trim: true
        },
        state: {
            type: String,
            required: [true, "State is required"],
            trim: true
        },
        pincode: {
            type: String,
            required: [true, "Pincode is required"],
            validate: {
                validator: function(value) {
                    return /^\d{6}$/.test(value);
                },
                message: "Please provide a valid 6-digit pincode"
            }
        }
    },
    assetTypes: [{
        type: String,
        enum: {
            values: ["Real Estate", "Financial"],
            message: "Please select correct asset type"
        }
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    walletAddress: {
        type: String,
        unique: true,
        sparse: true,
        validate: {
            validator: function(value) {
                return /^0x[a-fA-F0-9]{40}$/.test(value);
            },
            message: "Please provide a valid Ethereum wallet address"
        }
    }
}, {
    timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1, aadhaarNumber: 1, panNumber: 1 });

export const User = mongoose.model("User", userSchema);