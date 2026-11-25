import {
  Household,
  HealthSurvey,
  User,
  Recommendation,
  FollowUp,
  PregnancyRecord,
  AntenatalAppointment,
} from '../models/index.js';

export const getStatistics = async (req, res, next) => {
  try {
    const households = await Household.find({});
    const surveys = await HealthSurvey.find({});
    const users = await User.find({});
    const recommendations = await Recommendation.find({});
    const followups = await FollowUp.find({});
    const pregnancyRecords = await PregnancyRecord.find({});
    const appointments = await AntenatalAppointment.find({});

    const totalHouseholds = households.length;
    const totalSurveyed = surveys.length;
    const surveyCompletionRate = totalHouseholds > 0
      ? Math.round((totalSurveyed / totalHouseholds) * 100)
      : 0;

    const totalVillagers = households.reduce((sum, h) => sum + (Number(h.totalMembers) || 0), 0);
    const totalHealthWorkers = users.filter((u) => u.role === 'health_worker').length;

    // Follow-ups stats
    const pendingRecommendations = recommendations.filter((r) => r.status === 'pending').length;
    const followedUpRecommendations = recommendations.filter((r) => r.status === 'followed_up').length;
    const sharedRecommendations = recommendations.filter((r) => r.status === 'shared').length;

    // Maternal Summary (Aggregated metrics only for authorized role view)
    const activePregnancies = pregnancyRecords.filter((p) => p.pregnancyStatus === 'active').length;
    const highRiskPregnancies = pregnancyRecords.filter((p) => p.providerConfirmedHighRisk).length;
    const upcomingAppointments = appointments.filter((a) => a.status === 'scheduled').length;
    const missedAppointments = appointments.filter((a) => a.status === 'missed').length;

    res.status(200).json({
      success: true,
      data: {
        totalHouseholds,
        totalSurveyed,
        surveyCompletionRate,
        totalVillagers,
        totalHealthWorkers,
        pendingRecommendations,
        followedUpRecommendations,
        sharedRecommendations,
        // Confidential maternal aggregated metrics (authorized only)
        maternalHealth: {
          totalBeneficiaries: pregnancyRecords.length,
          activePregnancies,
          highRiskPregnancies,
          upcomingAppointments,
          missedAppointments,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getSurveyAnalytics = async (req, res, next) => {
  try {
    const { street } = req.query;
    let households = await Household.find({});
    let surveys = await HealthSurvey.find({});

    if (street && street !== 'All') {
      const validHhIds = new Set(
        households.filter((h) => h.street === street).map((h) => h.householdId)
      );
      surveys = surveys.filter((s) => validHhIds.has(s.householdId));
    }

    const totalSurveys = surveys.length;

    // 1. Handwashing Distribution
    const handwashing = {
      always: surveys.filter((s) => s.sectionB_hygiene?.regularHandwashingWithSoap === 'always').length,
      sometimes: surveys.filter((s) => s.sectionB_hygiene?.regularHandwashingWithSoap === 'sometimes').length,
      rarely: surveys.filter((s) => s.sectionB_hygiene?.regularHandwashingWithSoap === 'rarely').length,
    };

    // 2. Water Storage Covered vs Uncovered
    const waterStorage = {
      covered: surveys.filter((s) => s.sectionC_water?.storedInCoveredContainer === true).length,
      uncovered: surveys.filter((s) => s.sectionC_water?.storedInCoveredContainer === false).length,
    };

    // 3. Water Treatment Practice
    const waterTreatment = {
      treated: surveys.filter((s) => s.sectionC_water?.waterTreatedIfUncertain === true).length,
      untreated: surveys.filter((s) => s.sectionC_water?.waterTreatedIfUncertain === false).length,
    };

    // 4. Waste Disposal Methods
    const wasteDisposal = {
      panchayat_collection: surveys.filter((s) => s.sectionD_sanitation?.wasteDisposalMethod === 'panchayat_collection').length,
      compost_pit: surveys.filter((s) => s.sectionD_sanitation?.wasteDisposalMethod === 'compost_pit').length,
      burning: surveys.filter((s) => s.sectionD_sanitation?.wasteDisposalMethod === 'burning').length,
      open_dumping: surveys.filter((s) => s.sectionD_sanitation?.wasteDisposalMethod === 'open_dumping').length,
    };

    // 5. Toilet Availability
    const toiletAvailability = {
      individual_household: surveys.filter((s) => s.sectionD_sanitation?.toiletAvailability === 'individual_household').length,
      community_toilet: surveys.filter((s) => s.sectionD_sanitation?.toiletAvailability === 'community_toilet').length,
      open_defecation: surveys.filter((s) => s.sectionD_sanitation?.toiletAvailability === 'open_defecation').length,
    };

    // 6. Mosquito Risk Indicators
    const mosquitoIndicators = {
      stagnantWaterPresent: surveys.filter((s) => s.sectionF_mosquito?.stagnantWaterNearHouse === true).length,
      containersDiscarded: surveys.filter((s) => s.sectionF_mosquito?.waterInContainersDiscarded === true).length,
      netsUsed: surveys.filter((s) => s.sectionF_mosquito?.mosquitoNetsOrProtectionUsed === true).length,
    };

    // 7. Street-wise Survey Distribution
    const streetMap = {};
    for (const h of households) {
      if (!streetMap[h.street]) streetMap[h.street] = { street: h.street, registered: 0, surveyed: 0 };
      streetMap[h.street].registered += 1;
    }
    for (const s of surveys) {
      const h = households.find((hh) => hh.householdId === s.householdId);
      if (h && streetMap[h.street]) {
        streetMap[h.street].surveyed += 1;
      }
    }
    const streetAnalytics = Object.values(streetMap);

    // 8. Recommendation Category Distribution
    const allRecs = await Recommendation.find({});
    const recCategoryCount = {
      water: allRecs.filter((r) => r.category === 'water').length,
      hygiene: allRecs.filter((r) => r.category === 'hygiene').length,
      sanitation: allRecs.filter((r) => r.category === 'sanitation').length,
      mosquito: allRecs.filter((r) => r.category === 'mosquito').length,
      menstrual: allRecs.filter((r) => r.category === 'menstrual').length,
      general_health: allRecs.filter((r) => r.category === 'general_health').length,
    };

    res.status(200).json({
      success: true,
      analytics: {
        totalSurveys,
        handwashing,
        waterStorage,
        waterTreatment,
        wasteDisposal,
        toiletAvailability,
        mosquitoIndicators,
        streetAnalytics,
        recCategoryCount,
      },
    });
  } catch (err) {
    next(err);
  }
};
