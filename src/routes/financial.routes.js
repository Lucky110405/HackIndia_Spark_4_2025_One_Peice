import { Router } from 'express';
import { financialAssetController } from '../controllers/financial.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.use(verifyJWT);

router.post('/create', 
    upload.fields([
        { name: 'assetDocuments', maxCount: 10 }
    ]), 
    financialAssetController.createAsset
);

router.post('/:id/documents', 
    upload.array('documents', 10),
    financialAssetController.addAssetDocuments
);
router.get('/all', financialAssetController.getAllAssets);
router.get('/:id', financialAssetController.getAssetById);
router.patch('/:id', financialAssetController.updateAsset);
router.post('/:id/transfer', financialAssetController.transferAsset);
router.post('/:id/documents', financialAssetController.addAssetDocuments);

export default router;