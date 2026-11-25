import express from 'express';
import { getStatistics, getSurveyAnalytics } from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/statistics', protect, getStatistics);
router.get('/survey-analytics', protect, getSurveyAnalytics);

export default router;
