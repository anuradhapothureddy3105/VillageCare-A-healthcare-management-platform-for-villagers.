import express from 'express';
import {
  getRecommendationsByHousehold,
  generateRecommendations,
  updateRecommendationStatus,
  getRules,
  updateRules,
} from '../controllers/recommendationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/rules', protect, getRules);
router.put('/rules', protect, authorize('admin'), updateRules);
router.get('/:householdId', protect, getRecommendationsByHousehold);
router.post('/generate', protect, authorize('admin', 'health_worker'), generateRecommendations);
router.put('/:id/status', protect, authorize('admin', 'health_worker'), updateRecommendationStatus);

export default router;
