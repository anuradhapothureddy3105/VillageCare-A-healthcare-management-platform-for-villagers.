import express from 'express';
import {
  getHouseholds,
  getHouseholdById,
  createHousehold,
  updateHousehold,
  deleteHousehold,
} from '../controllers/householdController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getHouseholds);
router.get('/:id', protect, getHouseholdById);
router.post('/', protect, authorize('admin', 'health_worker'), createHousehold);
router.put('/:id', protect, authorize('admin', 'health_worker'), updateHousehold);
router.delete('/:id', protect, authorize('admin'), deleteHousehold);

export default router;
