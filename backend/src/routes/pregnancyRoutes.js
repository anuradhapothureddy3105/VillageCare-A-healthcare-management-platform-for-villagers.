import express from 'express';
import {
  getPregnancyRecords,
  getPregnancyById,
  registerPregnancy,
  updatePregnancy,
} from '../controllers/pregnancyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getPregnancyRecords);
router.get('/:id', protect, getPregnancyById);
router.post('/', protect, authorize('admin', 'health_worker'), registerPregnancy);
router.put('/:id', protect, authorize('admin', 'health_worker'), updatePregnancy);

export default router;
