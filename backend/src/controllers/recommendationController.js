import { Recommendation, HealthSurvey, SystemSetting } from '../models/index.js';
import { generateRecommendationsForSurvey, DEFAULT_RULES } from '../services/recommendationEngine.js';

export const getRecommendationsByHousehold = async (req, res, next) => {
  try {
    const { householdId } = req.params;
    const recommendations = await Recommendation.find({ householdId });

    res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (err) {
    next(err);
  }
};

export const generateRecommendations = async (req, res, next) => {
  try {
    const { householdId } = req.body;
    if (!householdId) {
      return res.status(400).json({ success: false, message: 'Household ID is required.' });
    }

    const survey = await HealthSurvey.findOne({ householdId });
    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'No survey found for this household. Complete the survey first.',
      });
    }

    await Recommendation.deleteMany({ householdId });
    const generated = await generateRecommendationsForSurvey(survey);

    res.status(200).json({
      success: true,
      count: generated.length,
      recommendations: generated,
    });
  } catch (err) {
    next(err);
  }
};

export const updateRecommendationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!['pending', 'shared', 'followed_up'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    let rec = await Recommendation.findOne({ recommendationId: id });
    const targetId = rec ? (rec._id || rec.id) : id;

    const updated = await Recommendation.findByIdAndUpdate(
      targetId,
      {
        status,
        notes: notes !== undefined ? notes : (rec ? rec.notes : ''),
        followedUpAt: status === 'followed_up' ? new Date() : null,
        followedUpBy: req.user ? req.user.fullName : 'Health Worker',
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Recommendation not found.' });
    }

    res.status(200).json({
      success: true,
      message: `Recommendation marked as ${status}.`,
      recommendation: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const getRules = async (req, res, next) => {
  try {
    const setting = await SystemSetting.findOne({ key: 'recommendation_rules' });
    const rules = setting && setting.rules && setting.rules.length > 0 ? setting.rules : DEFAULT_RULES;

    res.status(200).json({
      success: true,
      rules,
      isEditable: true,
      governingPrinciples: [
        'Purely educational and preventive; strictly non-diagnostic.',
        'Aligned with WHO and National Health Mission hygiene benchmarks.',
        'Fully transparent logic with bilingual Telugu and English guidance.',
      ],
    });
  } catch (err) {
    next(err);
  }
};

export const updateRules = async (req, res, next) => {
  try {
    const { rules } = req.body;
    if (!Array.isArray(rules)) {
      return res.status(400).json({ success: false, message: 'Rules must be an array.' });
    }

    let setting = await SystemSetting.findOne({ key: 'recommendation_rules' });
    if (setting) {
      setting = await SystemSetting.findByIdAndUpdate(
        setting._id || setting.id,
        { rules },
        { new: true }
      );
    } else {
      setting = await SystemSetting.create({
        key: 'recommendation_rules',
        rules,
        villageName: 'Pentapadu',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Recommendation rules updated successfully by administrator.',
      rules: setting.rules,
    });
  } catch (err) {
    next(err);
  }
};
