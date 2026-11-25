import { seedDatabase, clearDemoData } from '../data/seedData.js';
import { Household, HealthSurvey, PregnancyRecord, User } from '../models/index.js';

export const seedDemo = async (req, res, next) => {
  try {
    await seedDatabase();
    res.status(200).json({
      success: true,
      message: 'Demo dataset for Pentapadu Village seeded successfully with 20 households, surveys, and maternal records.',
    });
  } catch (err) {
    next(err);
  }
};

export const clearDemo = async (req, res, next) => {
  try {
    await clearDemoData();
    res.status(200).json({
      success: true,
      message: 'Fictional demo data cleared successfully from system.',
    });
  } catch (err) {
    next(err);
  }
};

export const getDemoStatus = async (req, res, next) => {
  try {
    const demoHouseholdsCount = await Household.countDocuments({ isDemoData: true });
    const demoSurveysCount = await HealthSurvey.countDocuments({ isDemoData: true });
    const demoPregnancyCount = await PregnancyRecord.countDocuments({ isDemoData: true });

    res.status(200).json({
      success: true,
      isDemoActive: demoHouseholdsCount > 0,
      stats: {
        demoHouseholds: demoHouseholdsCount,
        demoSurveys: demoSurveysCount,
        demoPregnancies: demoPregnancyCount,
      },
      village: 'Pentapadu, West Godavari, Andhra Pradesh',
    });
  } catch (err) {
    next(err);
  }
};
