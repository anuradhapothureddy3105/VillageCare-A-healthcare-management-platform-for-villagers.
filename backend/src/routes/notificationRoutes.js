import express from 'express';
import {
  getNotifications,
  markAsRead,
  createNotification,
  markAllAsRead,
} from '../controllers/notificationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/mark-all', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);
router.post('/', protect, authorize('admin', 'health_worker'), createNotification);

export default router;
