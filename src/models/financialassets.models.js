import mongoose, { Schema } from "mongoose";

const financialAssetSchema = new Schema({
    assetId: {
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
    assetType: {
        type: String,
        enum: {
            values: [
                "Stocks",
                "Bonds",
                "Mutual_Funds",
                "Fixed_Deposits",
                "Insurance_Policies",
                "Debentures",
                "Government_Securities"
            ],
            message: "Please select valid financial asset type"
        },
        required: true
    },
    assetDetails: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        issuer: {
            type: String,
            required: true
        },
        issuanceDate: {
            type: Date,
            required: true
        },
        maturityDate: {
            type: Date
        },
        quantity: {
            type: Number,
            default: 1
        },
        denomination: {
            type: Number
        }
    },
    valuation: {
        purchaseValue: {
            type: Number,
            required: true
        },
        currentValue: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: "INR"
        },
        lastValuationDate: {
            type: Date,
            required: true
        }
    },
    returns: {
        interestRate: {
            type: Number
        },
        dividendYield: {
            type: Number
        },
        paymentFrequency: {
            type: String,
            enum: ["Monthly", "Quarterly", "Semi-Annual", "Annual", "On_Maturity"]
        }
    },
    riskProfile: {
        type: String,
        enum: ["Low", "Medium", "High"],
        required: true
    },
    documentDetails: {
        certificateNumber: {
            type: String
        },
        documentLinks: [{
            type: String
        }],
        verificationStatus: {
            type: Boolean,
            default: false
        }
    },
    transactionHistory: [{
        transactionType: {
            type: String,
            enum: ["Purchase", "Sale", "Transfer", "Interest_Payment", "Dividend"],
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        counterparty: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        transactionId: {
            type: String
        }
    }],
    nftDetails: {
        tokenId: {
            type: String,
            unique: true
        },
        contractAddress: {
            type: String
        },
        blockchain: {
            type: String,
            default: "Ethereum"
        }
    },
    status: {
        type: String,
        enum: ["Active", "Matured", "Redeemed", "Frozen"],
        default: "Active"
    },
    regulatoryInfo: {
        regulatoryBody: String,
        registrationNumber: String,
        complianceStatus: {
            type: Boolean,
            default: true
        }
    },
    documentDetails: {
        certificateNumber: {
            type: String
        },
        documents: [{
            type: Schema.Types.ObjectId,
            ref: 'Document'
        }],
        verificationStatus: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true
});

// Indexes for faster queries
financialAssetSchema.index({ owner: 1, assetType: 1 });
financialAssetSchema.index({ "nftDetails.tokenId": 1 });

// Virtual for calculating holding period
financialAssetSchema.virtual('holdingPeriod').get(function() {
    return Math.floor((new Date() - this.assetDetails.issuanceDate) / (1000 * 60 * 60 * 24));
});

export const FinancialAsset = mongoose.model("FinancialAsset", financialAssetSchema);