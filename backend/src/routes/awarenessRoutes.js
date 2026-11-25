import express from 'express';
import {
  getAwarenessList,
  getAwarenessById,
  createAwareness,
  updateAwareness,
} from '../controllers/awarenessController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAwarenessList);
router.get('/:id', getAwarenessById);
router.post('/', protect, authorize('admin'), createAwareness);
router.put('/:id', protect, authorize('admin'), updateAwareness);

export default router;
