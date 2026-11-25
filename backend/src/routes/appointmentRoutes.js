import express from 'express';
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAppointments);
router.post('/', protect, authorize('admin', 'health_worker'), createAppointment);
router.put('/:id', protect, authorize('admin', 'health_worker'), updateAppointment);
router.delete('/:id', protect, authorize('admin'), deleteAppointment);

export default router;
