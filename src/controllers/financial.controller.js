import { FinancialAsset } from '../models/financialassets.models.js';
import { Document } from '../models/document.models.js';
import { User } from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../services/cloudinary.services.js';
import { uploadToS3 } from '../utils/s3.js';
// import { ethers } from 'ethers';
import fs from 'fs/promises';

export const financialAssetController = {
    async createAsset(req, res) {
        try {
            const assetData = req.body;
            
            // Handle certificate images or scanned documents
            if (req.files?.assetDocuments) {
                const documentUrls = await Promise.all(
                    req.files.assetDocuments.map(async (file) => {
                        let fileUrl;
                        if (file.mimetype.startsWith('image/')) {
                            fileUrl = await uploadOnCloudinary(file.path);
                        } else {
                            fileUrl = await uploadToS3(file, 'financial-documents');
                        }
                        await fs.unlink(file.path);
                        return fileUrl;
                    })
                );
                assetData.documentDetails = {
                    ...assetData.documentDetails,
                    documentUrls
                };
            }

            const asset = await FinancialAsset.create({
                ...assetData,
                owner: req.user._id
            });

            return res.status(201).json(
                new ApiResponse(201, asset, "Financial asset created successfully")
            );
        } catch (error) {
            throw new ApiError(400, error?.message || "Error creating financial asset");
        }
    },

    async addAssetDocuments(req, res) {
        try {
            const asset = await FinancialAsset.findById(req.params.id);
            
            if (!asset) {
                throw new ApiError(404, "Asset not found");
            }

            const documents = await Promise.all(
                req.files.map(async (file) => {
                    let fileUrl;
                    if (file.mimetype.startsWith('image/')) {
                        fileUrl = await uploadOnCloudinary(file.path);
                    } else {
                        fileUrl = await uploadToS3(file, 'financial-documents');
                    }

                    await fs.unlink(file.path);

                    return {
                        title: file.originalname,
                        type: file.mimetype.startsWith('image/') ? 'image' : 'pdf',
                        category: req.body.category || 'Financial_Document',
                        fileUrl,
                        fileHash: ethers.utils.keccak256(
                            ethers.utils.toUtf8Bytes(await fs.readFile(file.path))
                        ),
                        assetId: asset._id,
                        assetModel: 'FinancialAsset',
                        uploadedBy: req.user._id,
                        metadata: {
                            size: file.size,
                            format: file.mimetype,
                            pageCount: req.body.pageCount
                        }
                    };
                })
            );

            const newDocs = await Document.create(documents);

            // Update asset with new document references
            asset.documentDetails.documents.push(...newDocs.map(doc => doc._id));
            await asset.save();

            return res.status(200).json(
                new ApiResponse(200, newDocs, "Documents added successfully")
            );
        } catch (error) {
            throw new ApiError(400, error?.message || "Error adding documents");
        }
    },

    async getAssetById(req, res) {
        try {
            const asset = await FinancialAsset.findById(req.params.id)
                .populate({
                    path: 'documentDetails.documents',
                    select: 'title type category fileUrl uploadDate verificationStatus'
                });
            
            if (!asset) {
                throw new ApiError(404, "Asset not found");
            }

            return res.status(200).json(
                new ApiResponse(200, asset, "Asset fetched successfully")
            );
        } catch (error) {
            throw new ApiError(400, error?.message || "Error fetching asset");
        }
    }
};