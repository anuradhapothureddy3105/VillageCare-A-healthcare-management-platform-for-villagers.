import express from 'express';
import {
  getSurveys,
  getSurveyById,
  createSurvey,
  updateSurvey,
  deleteSurvey,
} from '../controllers/surveyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getSurveys);
router.get('/:id', protect, getSurveyById);
router.post('/', protect, authorize('admin', 'health_worker'), createSurvey);
router.put('/:id', protect, authorize('admin', 'health_worker'), updateSurvey);
router.delete('/:id', protect, authorize('admin'), deleteSurvey);

export default router;
