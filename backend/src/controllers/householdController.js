import { Household, HealthSurvey, Recommendation, ConsentRecord } from '../models/index.js';

export const getHouseholds = async (req, res, next) => {
  try {
    const { street, search, isDemoData } = req.query;
    let query = {};

    if (street && street !== 'All') {
      query.street = street;
    }

    if (isDemoData !== undefined) {
      query.isDemoData = isDemoData === 'true';
    }

    let households = await Household.find(query);

    if (search && search.trim()) {
      const s = search.toLowerCase().trim();
      households = households.filter(
        (h) =>
          (h.headOfHousehold && h.headOfHousehold.toLowerCase().includes(s)) ||
          (h.householdId && h.householdId.toLowerCase().includes(s)) ||
          (h.street && h.street.toLowerCase().includes(s)) ||
          (h.contactNumber && h.contactNumber.includes(s))
      );
    }

    // Attach survey status to each household
    const allSurveys = await HealthSurvey.find({});
    const surveyMap = {};
    allSurveys.forEach((srv) => {
      surveyMap[srv.householdId] = srv;
    });

    const enriched = households.map((h) => {
      const srv = surveyMap[h.householdId];
      return {
        ...h,
        hasSurvey: !!srv,
        surveyStatus: srv ? srv.completionStatus : 'unregistered',
        lastSurveyDate: srv ? srv.surveyDate : null,
      };
    });

    res.status(200).json({
      success: true,
      count: enriched.length,
      households: enriched,
    });
  } catch (err) {
    next(err);
  }
};

export const getHouseholdById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let household = await Household.findOne({ householdId: id });
    if (!household) {
      household = await Household.findById(id);
    }

    if (!household) {
      return res.status(404).json({ success: false, message: 'Household not found.' });
    }

    const surveys = await HealthSurvey.find({ householdId: household.householdId });
    const recommendations = await Recommendation.find({ householdId: household.householdId });

    res.status(200).json({
      success: true,
      household,
      surveys,
      recommendations,
    });
  } catch (err) {
    next(err);
  }
};

export const createHousehold = async (req, res, next) => {
  try {
    const {
      householdId,
      headOfHousehold,
      street,
      totalMembers,
      ageGroups,
      contactNumber,
      notes,
    } = req.body;

    if (!householdId || !headOfHousehold || !street || !totalMembers) {
      return res.status(400).json({
        success: false,
        message: 'Household ID, head of household, street, and total members are required.',
      });
    }

    const existing = await Household.findOne({ householdId: householdId.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Household ID ${householdId} already exists. Please use a unique ID.`,
      });
    }

    const newHousehold = await Household.create({
      householdId: householdId.trim().toUpperCase(),
      headOfHousehold: headOfHousehold.trim(),
      village: 'Pentapadu',
      mandal: 'Pentapadu',
      district: 'West Godavari',
      street: street.trim(),
      totalMembers: Number(totalMembers),
      ageGroups: ageGroups || { children: 0, adults: Number(totalMembers), elderly: 0 },
      contactNumber: contactNumber ? contactNumber.trim() : '',
      registeredBy: req.user ? req.user.fullName : 'Health Worker',
      registrationDate: new Date(),
      notes: notes || '',
      isDemoData: false,
    });

    await ConsentRecord.create({
      consentId: `CSNT-HH-${Date.now().toString(36)}`,
      villagerName: headOfHousehold,
      householdId: newHousehold.householdId,
      purpose: 'survey',
      consentType: 'explicit_dpdp_2023',
      consentStatus: 'granted',
      details: 'Voluntary household registration consent recorded.',
      recordedBy: req.user ? req.user.username : 'admin',
    });

    res.status(201).json({
      success: true,
      message: 'Household registered successfully.',
      household: newHousehold,
    });
  } catch (err) {
    next(err);
  }
};

export const updateHousehold = async (req, res, next) => {
  try {
    const { id } = req.params;
    let household = await Household.findOne({ householdId: id });
    const targetId = household ? (household._id || household.id) : id;

    const updated = await Household.findByIdAndUpdate(targetId, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Household not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Household updated successfully.',
      household: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteHousehold = async (req, res, next) => {
  try {
    const { id } = req.params;
    let household = await Household.findOne({ householdId: id });
    const targetId = household ? (household._id || household.id) : id;
    const hhId = household ? household.householdId : id;

    const deleted = await Household.findByIdAndDelete(targetId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Household not found.' });
    }

    // Clean up dependent survey and recommendations
    await HealthSurvey.deleteMany({ householdId: hhId });
    await Recommendation.deleteMany({ householdId: hhId });

    res.status(200).json({
      success: true,
      message: 'Household and associated survey records deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};
