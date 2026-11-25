import express from 'express';
import { seedDemo, clearDemo, getDemoStatus } from '../controllers/demoController.js';

const router = express.Router();

router.get('/status', getDemoStatus);
router.post('/seed', seedDemo);
router.post('/clear', clearDemo);

export default router;
