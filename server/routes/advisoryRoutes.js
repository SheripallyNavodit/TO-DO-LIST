import express from 'express';
import {
  createAdvisory,
  getAdvisories,
  getAdvisoryById,
  deleteAdvisory,
  getAdvisoryActions,
  updateActionStatus
} from '../controllers/advisoryController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { advisoryRequestSchema, updateActionSchema } from '../schemas/advisorySchemas.js';
import { advisoryLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

// Advisory Generation & Listing
router.post('/advisories', advisoryLimiter, validateBody(advisoryRequestSchema), createAdvisory);
router.get('/advisories', getAdvisories);
router.get('/advisories/:id', getAdvisoryById);
router.delete('/advisories/:id', deleteAdvisory);

// Advisory Action Plans
router.get('/advisories/:id/actions', getAdvisoryActions);
router.patch('/advisory-actions/:id', validateBody(updateActionSchema), updateActionStatus);

export default router;
