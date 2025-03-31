import { ethers } from 'ethers';
import { ApiError } from '../utils/ApiError.js';
import RealEstate from '../models/realestate.models.js';
import FinancialAsset from '../models/financialassets.models.js';
import User from '../models/user.models.js';
import Document from '../models/document.models.js';

const provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

export const blockchainController = {
    async uploadToBlockchain(assetId, assetType) {
        let asset = null;
        try {
            const contractAddress = assetType === 'realestate' 
                ? process.env.REALESTATE_CONTRACT_ADDRESS 
                : process.env.FINANCIAL_CONTRACT_ADDRESS;
            
            const contract = new ethers.Contract(
                contractAddress,
                assetType === 'realestate' ? RealEstateABI : FinancialABI,
                signer
            );

            asset = assetType === 'realestate'
                ? await RealEstate.findById(assetId).populate('owner')
                : await FinancialAsset.findById(assetId).populate('owner');

            if (!asset) {
                throw new ApiError(404, "Asset not found");
            }

            if (!asset.owner.walletAddress) {
                throw new ApiError(400, "Owner wallet address not found");
            }

            // Generate unique hash for asset
            const assetHash = ethers.utils.keccak256(
                ethers.utils.defaultAbiCoder.encode(
                    ['string', 'string', 'address'],
                    [
                        asset.propertyId || asset.assetId,
                        asset.owner._id.toString(),
                        asset.owner.walletAddress
                    ]
                )
            );

            // Check for duplicates using hash
            const existingAsset = await contract.getAssetByHash(assetHash);
            if (existingAsset && existingAsset.exists) {
                await this.cleanupDatabase(assetId, assetType);
                throw new ApiError(409, "Asset already exists on blockchain");
            }

            // Prepare metadata for blockchain
            const metadata = {
                id: asset._id.toString(),
                type: assetType,
                owner: asset.owner.walletAddress,
                details: assetType === 'realestate' ? {
                    propertyId: asset.propertyId,
                    propertyType: asset.propertyType,
                    location: asset.propertyDetails.location,
                    area: asset.propertyDetails.area,
                    registrationNumber: asset.legalInformation.registrationNumber
                } : {
                    assetId: asset.assetId,
                    assetType: asset.assetType,
                    issuer: asset.issuer,
                    value: asset.valuation.currentValue
                },
                timestamp: Date.now()
            };

            // Upload to blockchain with gas optimization
            const tx = await contract.mintAsset(
                asset.owner.walletAddress,
                assetHash,
                JSON.stringify(metadata),
                {
                    gasLimit: ethers.utils.hexlify(1000000),
                    gasPrice: await provider.getGasPrice()
                }
            );

            const receipt = await tx.wait(2); // Wait for 2 block confirmations
            const tokenId = receipt.events[0].args.tokenId.toString();

            // Store blockchain data and delete from database
            const blockchainData = {
                tokenId,
                transactionHash: receipt.transactionHash,
                contractAddress,
                assetHash,
                metadata
            };

            // Cleanup database after successful blockchain upload
            await this.cleanupDatabase(assetId, assetType);

            return blockchainData;
        } catch (error) {
            if (asset) {
                await this.cleanupDatabase(assetId, assetType);
            }
            throw new ApiError(500, `Blockchain upload failed: ${error.message}`);
        }
    },

    async cleanupDatabase(assetId, assetType) {
        try {
            // Delete associated documents
            await Document.deleteMany({
                assetId,
                assetModel: assetType === 'realestate' ? 'RealEstate' : 'FinancialAsset'
            });

            // Delete the asset
            const Model = assetType === 'realestate' ? RealEstate : FinancialAsset;
            await Model.findByIdAndDelete(assetId);
        } catch (error) {
            console.error('Database cleanup error:', error);
        }
    },

    async verifyBlockchainStatus(assetId, assetType) {
        try {
            const contractAddress = assetType === 'realestate' 
                ? process.env.REALESTATE_CONTRACT_ADDRESS 
                : process.env.FINANCIAL_CONTRACT_ADDRESS;
            
            const contract = new ethers.Contract(
                contractAddress,
                assetType === 'realestate' ? RealEstateABI : FinancialABI,
                provider
            );
            // Delete from database if blockchain upload fails
            const asset = assetType === 'realestate'
                ? await RealEstate.findById(assetId).populate('owner')
                : await FinancialAsset.findById(assetId).populate('owner');

            if (!asset) return { exists: false, message: "Asset not found in database" };

            const assetHash = ethers.utils.keccak256(
                ethers.utils.defaultAbiCoder.encode(
                    ['string', 'string', 'address'],
                    [
                        asset.propertyId || asset.assetId,
                        asset.owner._id.toString(),
                        asset.owner.walletAddress
                    ]
                )
            );

            const blockchainAsset = await contract.getAssetByHash(assetHash);
            
            if (!blockchainAsset || !blockchainAsset.exists) {
                await this.cleanupDatabase(assetId, assetType);
                return { exists: false, message: "Asset not found on blockchain" };
            }

            return { 
                exists: true, 
                blockchainData: blockchainAsset,
                assetHash 
            };
        } catch (error) {
            await this.cleanupDatabase(assetId, assetType);
            return { exists: false, message: error.message };
        }
    }
};