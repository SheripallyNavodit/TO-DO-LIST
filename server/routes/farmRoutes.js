import express from 'express';
import {
  getFarms,
  getFarmById,
  createFarm,
  updateFarm,
  deleteFarm
} from '../controllers/farmController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { farmSchema, updateFarmSchema } from '../schemas/farmSchemas.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getFarms);
router.post('/', validateBody(farmSchema), createFarm);
router.get('/:id', getFarmById);
router.put('/:id', validateBody(updateFarmSchema), updateFarm);
router.delete('/:id', deleteFarm);

export default router;
