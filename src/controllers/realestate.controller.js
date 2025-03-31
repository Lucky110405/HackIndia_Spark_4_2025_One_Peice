import { RealEstate } from '../models/realestate.models.js';
import { Document } from '../models/document.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../services/cloudinary.services.js';
import { uploadToS3 } from '../utils/s3.js';
import fs from 'fs/promises';
import { blockchainController } from './blockchain.controller.js';

export const realEstateController = {
    async createProperty(req, res) {
        try {
            const propertyData = req.body;
            
            if (req.files?.propertyImages) {
                const imageUrls = await Promise.all(
                    req.files.propertyImages.map(async (file) => {
                        const cloudinaryUrl = await uploadOnCloudinary(file.path);
                        await fs.unlink(file.path);
                        return cloudinaryUrl;
                    })
                );
                propertyData.propertyImages = imageUrls;
            }

            const property = await RealEstate.create({
                ...propertyData,
                owner: req.user._id
            });

            return res.status(201).json(
                new ApiResponse(201, property, "Property created successfully")
            );
        } catch (error) {
            throw new ApiError(400, error?.message || "Error creating property");
        }
    },

    async addPropertyDocuments(req, res) {
        try {
            const property = await RealEstate.findById(req.params.id);
            
            if (!property) {
                throw new ApiError(404, "Property not found");
            }

            const documents = await Promise.all(
                req.files.map(async (file) => {
                    let fileUrl;
                    if (file.mimetype.startsWith('image/')) {
                        fileUrl = await uploadOnCloudinary(file.path);
                    } else {
                        fileUrl = await uploadToS3(file, 'property-documents');
                    }

                    await fs.unlink(file.path);

                    return {
                        title: file.originalname,
                        type: file.mimetype.startsWith('image/') ? 'image' : 'pdf',
                        category: req.body.category || 'Legal_Document',
                        fileUrl,
                        fileHash: req.body.fileHash,
                        assetId: property._id,
                        assetModel: 'RealEstate',
                        uploadedBy: req.user._id
                    };
                })
            );

            const newDocs = await Document.create(documents);

            if (req.body.category === 'Legal_Document') {
                property.legalInformation.documents.push(...newDocs.map(doc => doc._id));
            } else {
                property.propertyImages.push(...newDocs.map(doc => doc._id));
            }
            await property.save();

            return res.status(200).json(
                new ApiResponse(200, newDocs, "Documents added successfully")
            );
        } catch (error) {
            throw new ApiError(400, error?.message || "Error adding documents");
        }
    },
    async createProperty(req, res) {
        try {
            const property = await RealEstate.create({
                ...req.body,
                owner: req.user._id
            });

            const blockchainResult = await blockchainController.uploadToBlockchain(
                property._id,
                'realestate'
            );

            return res.status(201).json(
                new ApiResponse(201, { ...property.toObject(), blockchain: blockchainResult })
            );
        } catch (error) {
            throw new ApiError(400, error?.message);
        }
    },

    async verifyBlockchainStatus(req, res) {
        try {
            const isValid = await blockchainController.verifyBlockchainStatus(
                req.params.id,
                'realestate'
            );

            return res.status(200).json(
                new ApiResponse(200, { isValid })
            );
        } catch (error) {
            throw new ApiError(400, error?.message);
        }
    }
};