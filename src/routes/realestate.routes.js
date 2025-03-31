import { Router } from 'express';
import { realEstateController } from '../controllers/realestate.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.use(verifyJWT);

router.post('/create', 
    upload.fields([
        { name: 'propertyImages', maxCount: 10 }
    ]), 
    realEstateController.createProperty
);

router.post('/:id/documents', 
    upload.array('documents', 10),
    realEstateController.addPropertyDocuments
);
router.get('/all', realEstateController.getAllProperties);
router.get('/:id', realEstateController.getPropertyById);
router.patch('/:id', realEstateController.updateProperty);
router.post('/:id/transfer', realEstateController.transferProperty);
router.post('/:id/documents', realEstateController.addPropertyDocuments);

export default router;