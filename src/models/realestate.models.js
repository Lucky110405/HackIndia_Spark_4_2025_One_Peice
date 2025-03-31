import mongoose, { Schema } from "mongoose";

const realEstateSchema = new Schema({
    propertyId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    propertyType: {
        type: String,
        enum: {
            values: [
                "Residential",
                "Commercial",
                "Industrial",
                "Land",
                "Agricultural"
            ],
            message: "Please select valid property type"
        },
        required: true
    },
    propertyDetails: {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        area: {
            type: Number,
            required: true
        },
        areaUnit: {
            type: String,
            enum: ["sqft", "sqm", "acres", "hectares"],
            default: "sqft"
        },
        location: {
            address: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            pincode: {
                type: String,
                required: true
            },
            coordinates: {
                latitude: Number,
                longitude: Number
            }
        }
    },
    legalInformation: {
        registrationNumber: {
            type: String,
            required: true
        },
        registrationDate: {
            type: Date,
            required: true
        },
        documentLinks: [{
            type: String  // URLs to property documents
        }]
    },
    valuation: {
        currentValue: {
            type: Number,
            required: true
        },
        lastValuationDate: {
            type: Date,
            required: true
        }
    },
    transactionHistory: [{
        previousOwner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        newOwner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        transactionDate: {
            type: Date
        },
        transactionValue: {
            type: Number
        },
        transactionId: {
            type: String
        }
    }],
    status: {
        type: String,
        enum: ["available", "sold", "underContract", "disputed"],
        default: "available"
    },
    nftTokenId: {
        type: String,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    legalInformation: {
        registrationNumber: {
            type: String,
            required: true
        },
        registrationDate: {
            type: Date,
            required: true
        },
        documents: [{
            type: Schema.Types.ObjectId,
            ref: 'Document'
        }]
    },
    propertyImages: [{
        type: Schema.Types.ObjectId,
        ref: 'Document'
    }],
    
}, { timestamps: true });

export const RealEstate = mongoose.model("RealEstate", realEstateSchema);