import mongoose, { Schema } from "mongoose";

const documentSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ["image", "pdf"],
        required: true
    },
    category: {
        type: String,
        enum: [
            "Legal_Document",
            "Title_Deed",
            "Agreement",
            "Certificate",
            "Registration",
            "Tax_Document",
            "Valuation_Report",
            "Insurance_Policy",
            "Other"
        ],
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileHash: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    verificationStatus: {
        type: Boolean,
        default: false
    },
    verifiedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    metadata: {
        size: Number,
        format: String,
        resolution: String,
        pageCount: Number
    },
    assetId: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'assetModel'
    },
    assetModel: {
        type: String,
        required: true,
        enum: ['RealEstate', 'FinancialAsset']
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes for faster queries
documentSchema.index({ assetId: 1, category: 1 });
documentSchema.index({ uploadedBy: 1 });
documentSchema.index({ fileHash: 1 });

export const Document = mongoose.model("Document", documentSchema);