import express from 'express';
import {
  getFollowUps,
  createFollowUp,
  updateFollowUp,
} from '../controllers/followupController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getFollowUps);
router.post('/', protect, authorize('admin', 'health_worker'), createFollowUp);
router.put('/:id', protect, authorize('admin', 'health_worker'), updateFollowUp);

export default router;
