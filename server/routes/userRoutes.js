import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { updateProfileSchema } from '../schemas/authSchemas.js';

const router = express.Router();

router.use(authenticateToken);
router.get('/me', getProfile);
router.put('/me', validateBody(updateProfileSchema), updateProfile);

export default router;
