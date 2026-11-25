import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDbStatus } from './src/config/db.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { Household, User } from './src/models/index.js';
import { seedDatabase } from './src/data/seedData.js';

// Route imports
import authRoutes from './src/routes/authRoutes.js';
import householdRoutes from './src/routes/householdRoutes.js';
import surveyRoutes from './src/routes/surveyRoutes.js';
import recommendationRoutes from './src/routes/recommendationRoutes.js';
import pregnancyRoutes from './src/routes/pregnancyRoutes.js';
import appointmentRoutes from './src/routes/appointmentRoutes.js';
import followupRoutes from './src/routes/followupRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import awarenessRoutes from './src/routes/awarenessRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
import demoRoutes from './src/routes/demoRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    project: 'VILLAGECARE - Smart Village Health & Hygiene Monitoring System',
    communityTarget: 'Pentapadu Village, West Godavari District, Andhra Pradesh',
    database: getDbStatus(),
    timestamp: new Date().toISOString(),
  });
});

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/households', householdRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/pregnancy', pregnancyRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/followups', followupRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/awareness', awarenessRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/demo', demoRoutes);

// Serve Frontend Static build if present
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(frontendDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('VillageCare API Server running. Build frontend with `cd frontend && npm run build` to serve UI.');
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// Start Server and Seed initial data if empty
const startServer = async () => {
  try {
    await connectDB();

    // Check if initial users or households exist; if not, seed automatically
    const householdCount = await Household.countDocuments({});
    const userCount = await User.countDocuments({});
    if (householdCount === 0 || userCount === 0) {
      console.log('[Server] Database empty. Auto-seeding Pentapadu demo dataset...');
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`==================================================================`);
      console.log(`  VILLAGECARE Backend Server running on port: ${PORT}`);
      console.log(`  Target Community: Pentapadu Village, West Godavari, Andhra Pradesh`);
      console.log(`  Health Check: http://localhost:${PORT}/api/health`);
      console.log(`==================================================================`);
    });
  } catch (err) {
    console.error('Fatal: Failed to start backend server:', err.message);
    process.exit(1);
  }
};

startServer();

export default app;
