import e from "express";
import mongoose , {Schema} from "mongoose";

const userSchema = new Schema({
    FirstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    LastName: {
        type: String,
        required: true,
        trim: true, 
    },
    Email: {
        type: String,
        required: true,
        trim: true,  
    },
    DOB: {
        type: Date,
        required: true,
        trim: true,
    },
    AdharNo: {
        type: Number,
        required: true,
        trim: true, 
    },
    PANNo: {
        type: Number,
        required: true,
        trim: true,
    },
    PhoneNo: {
        type: Number,
        required: true,
        trim: true,
    },
    Address: {
        type: String,
        required: true,
        trim: true,
    },
    AssetType: {
        enum: {
            values: [
                "Real Estate",
                "Financial",
            ],
            message: "Please select correct AssetType" 
        },
        default: "none",
        required: true,
    },

},{timestamps: true});

export default mongoose.model("User", userSchema);