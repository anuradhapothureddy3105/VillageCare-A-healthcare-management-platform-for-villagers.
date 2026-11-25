import { HealthSurvey, Household, Recommendation, Notification } from '../models/index.js';
import { generateRecommendationsForSurvey } from '../services/recommendationEngine.js';

export const getSurveys = async (req, res, next) => {
  try {
    const { householdId, completionStatus, street } = req.query;
    let query = {};

    if (householdId) {
      query.householdId = householdId;
    }

    if (completionStatus) {
      query.completionStatus = completionStatus;
    }

    let surveys = await HealthSurvey.find(query);

    // If street filter provided, filter by household street
    if (street && street !== 'All') {
      const matchingHouseholds = await Household.find({ street });
      const validHhIds = new Set(matchingHouseholds.map((h) => h.householdId));
      surveys = surveys.filter((s) => validHhIds.has(s.householdId));
    }

    res.status(200).json({
      success: true,
      count: surveys.length,
      surveys,
    });
  } catch (err) {
    next(err);
  }
};

export const getSurveyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let survey = await HealthSurvey.findOne({ surveyId: id });
    if (!survey) {
      survey = await HealthSurvey.findById(id);
    }

    if (!survey) {
      return res.status(404).json({ success: false, message: 'Survey record not found.' });
    }

    const household = await Household.findOne({ householdId: survey.householdId });
    const recommendations = await Recommendation.find({ householdId: survey.householdId });

    res.status(200).json({
      success: true,
      survey,
      household,
      recommendations,
    });
  } catch (err) {
    next(err);
  }
};

export const createSurvey = async (req, res, next) => {
  try {
    const {
      householdId,
      sectionA_general,
      sectionB_hygiene,
      sectionC_water,
      sectionD_sanitation,
      sectionE_menstrual,
      sectionF_mosquito,
      completionStatus,
    } = req.body;

    if (!householdId) {
      return res.status(400).json({ success: false, message: 'Household ID is required.' });
    }

    const household = await Household.findOne({ householdId: householdId.trim() });
    if (!household) {
      return res.status(404).json({
        success: false,
        message: `Household with ID ${householdId} is not registered yet. Please register household first.`,
      });
    }

    // Check if an existing survey exists for this household
    let existingSurvey = await HealthSurvey.findOne({ householdId: householdId.trim() });

    const surveyId = existingSurvey
      ? existingSurvey.surveyId
      : `SRV-${householdId.trim()}-${Date.now().toString(36).toUpperCase()}`;

    const surveyData = {
      surveyId,
      householdId: householdId.trim(),
      surveyedBy: req.user ? req.user.fullName : 'ASHA Worker',
      surveyDate: new Date(),
      sectionA_general: sectionA_general || {},
      sectionB_hygiene: sectionB_hygiene || {},
      sectionC_water: sectionC_water || {},
      sectionD_sanitation: sectionD_sanitation || {},
      sectionE_menstrual: sectionE_menstrual || {},
      sectionF_mosquito: sectionF_mosquito || {},
      completionStatus: completionStatus || 'completed',
      isDemoData: false,
    };

    let savedSurvey;
    if (existingSurvey) {
      savedSurvey = await HealthSurvey.findByIdAndUpdate(
        existingSurvey._id || existingSurvey.id,
        surveyData,
        { new: true }
      );
      // Remove previous recommendations to regenerate cleanly
      await Recommendation.deleteMany({ householdId: householdId.trim() });
    } else {
      savedSurvey = await HealthSurvey.create(surveyData);
    }

    // Run Rule-Based Recommendation Engine
    const generatedRecommendations = await generateRecommendationsForSurvey(savedSurvey);

    // Create system notification for health workers/admins
    const hasHighPriority = generatedRecommendations.some((r) => r.priority === 'high');
    if (hasHighPriority) {
      await Notification.create({
        notificationId: `NOTIF-SRV-${Date.now().toString(36)}`,
        recipientRole: 'health_worker',
        title: {
          en: `Awareness Needs Identified: ${householdId}`,
          te: `పరిశుభ్రత అవగాహన సూచనలు: ${householdId}`,
        },
        message: {
          en: `Household survey for ${household.headOfHousehold} (${household.street}) generated ${generatedRecommendations.length} awareness recommendation(s).`,
          te: `${household.street} లోని ${household.headOfHousehold} గారి ఇంటి సర్వే పూర్తయింది. ${generatedRecommendations.length} అవగాహన సూచనలు గుర్తించబడ్డాయి.`,
        },
        type: 'survey_pending',
        relatedId: savedSurvey.surveyId,
        isRead: false,
        createdAt: new Date(),
      });
    }

    res.status(201).json({
      success: true,
      message: 'Health & hygiene survey submitted successfully.',
      survey: savedSurvey,
      recommendations: generatedRecommendations,
    });
  } catch (err) {
    next(err);
  }
};

export const updateSurvey = async (req, res, next) => {
  try {
    const { id } = req.params;
    let survey = await HealthSurvey.findOne({ surveyId: id });
    const targetId = survey ? (survey._id || survey.id) : id;

    const updated = await HealthSurvey.findByIdAndUpdate(targetId, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Survey not found.' });
    }

    // Re-generate recommendations if survey fields updated
    await Recommendation.deleteMany({ householdId: updated.householdId });
    const freshRecommendations = await generateRecommendationsForSurvey(updated);

    res.status(200).json({
      success: true,
      message: 'Survey updated and recommendations re-evaluated.',
      survey: updated,
      recommendations: freshRecommendations,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteSurvey = async (req, res, next) => {
  try {
    const { id } = req.params;
    let survey = await HealthSurvey.findOne({ surveyId: id });
    const targetId = survey ? (survey._id || survey.id) : id;
    const hhId = survey ? survey.householdId : null;

    const deleted = await HealthSurvey.findByIdAndDelete(targetId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Survey not found.' });
    }

    if (hhId) {
      await Recommendation.deleteMany({ householdId: hhId });
    }

    res.status(200).json({
      success: true,
      message: 'Survey and generated recommendations deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};
