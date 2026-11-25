import {
  PregnancyRecord,
  AntenatalAppointment,
  Notification,
  ConsentRecord,
  Household,
} from '../models/index.js';

// Calculate EDD using Naegele's rule (LMP + 280 days / 9 months + 7 days)
const calculateEDD = (lmp) => {
  const d = new Date(lmp);
  d.setDate(d.getDate() + 280);
  return d;
};

// Calculate current trimester
const calculateTrimester = (lmp) => {
  const diffDays = Math.floor((new Date() - new Date(lmp)) / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diffDays / 7);
  if (weeks <= 12) return 1;
  if (weeks <= 27) return 2;
  return 3;
};

export const getPregnancyRecords = async (req, res, next) => {
  try {
    // If user is villager, restrict strictly to their own matching record
    if (req.user.role === 'villager') {
      const records = await PregnancyRecord.find({
        $or: [
          { householdId: req.user.householdId },
          { villagerName: { $regex: req.user.fullName, $options: 'i' } },
        ],
      });
      return res.status(200).json({ success: true, count: records.length, records });
    }

    const { status, highRisk } = req.query;
    let query = {};
    if (status) query.pregnancyStatus = status;
    if (highRisk === 'true') query.providerConfirmedHighRisk = true;

    const records = await PregnancyRecord.find(query);
    res.status(200).json({ success: true, count: records.length, records });
  } catch (err) {
    next(err);
  }
};

export const getPregnancyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let record = await PregnancyRecord.findOne({ beneficiaryId: id });
    if (!record) {
      record = await PregnancyRecord.findById(id);
    }

    if (!record) {
      return res.status(404).json({ success: false, message: 'Maternal health record not found.' });
    }

    // Role privacy check
    if (
      req.user.role === 'villager' &&
      record.householdId !== req.user.householdId &&
      !record.villagerName.toLowerCase().includes(req.user.fullName.toLowerCase())
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Confidential maternal health record.',
      });
    }

    const appointments = await AntenatalAppointment.find({ beneficiaryId: record.beneficiaryId });
    const household = await Household.findOne({ householdId: record.householdId });

    res.status(200).json({
      success: true,
      record,
      appointments,
      household,
    });
  } catch (err) {
    next(err);
  }
};

export const registerPregnancy = async (req, res, next) => {
  try {
    const {
      beneficiaryId,
      villagerName,
      householdId,
      age,
      contactNumber,
      lmpDate,
      eddDate,
      healthcareFacility,
      gravida,
      para,
      providerConfirmedHighRisk,
      highRiskReasons,
      consentGiven,
    } = req.body;

    if (!villagerName || !householdId || !lmpDate) {
      return res.status(400).json({
        success: false,
        message: 'Beneficiary name, household ID, and LMP date are required.',
      });
    }

    if (consentGiven === false) {
      return res.status(400).json({
        success: false,
        message: 'Explicit beneficiary consent is required under DPDP Act 2023 for maternal record registration.',
      });
    }

    const computedEdd = eddDate ? new Date(eddDate) : calculateEDD(lmpDate);
    const trimester = calculateTrimester(lmpDate);
    const bId = beneficiaryId || `PREG-PTP-${Date.now().toString(36).slice(-5).toUpperCase()}`;

    const newRecord = await PregnancyRecord.create({
      beneficiaryId: bId,
      villagerName: villagerName.trim(),
      householdId: householdId.trim(),
      age: Number(age) || 24,
      contactNumber: contactNumber || '',
      consentGiven: true,
      consentDate: new Date(),
      registrationDate: new Date(),
      lmpDate: new Date(lmpDate),
      eddDate: computedEdd,
      healthcareFacility: healthcareFacility || 'Pentapadu Primary Health Centre (PHC)',
      assignedHealthWorker: req.user.fullName || 'ASHA Worker',
      gravida: Number(gravida) || 1,
      para: Number(para) || 0,
      providerConfirmedHighRisk: Boolean(providerConfirmedHighRisk),
      highRiskReasons: highRiskReasons || [],
      currentTrimester: trimester,
      pregnancyStatus: 'active',
      isDemoData: false,
    });

    // Record DPDP explicit consent
    await ConsentRecord.create({
      consentId: `CSNT-PREG-${Date.now().toString(36)}`,
      villagerName: villagerName.trim(),
      householdId: householdId.trim(),
      purpose: 'maternal_health',
      consentType: 'explicit_dpdp_2023',
      consentStatus: 'granted',
      details: 'Voluntary informed consent granted for pregnancy tracking, antenatal care reminders and PMSMA checkups.',
      recordedBy: req.user.username,
      recordedAt: new Date(),
    });

    // Automatically generate 4 standard Antenatal Check-up schedules based on NHM guidelines
    const lmp = new Date(lmpDate);
    const ancSchedules = [
      { type: 'ANC-1', weeks: 12, label: 'First Trimester Registration & Baseline ANC' },
      { type: 'ANC-2', weeks: 24, label: 'Second Trimester Check-up (14-26 weeks)' },
      { type: 'ANC-3', weeks: 32, label: 'Third Trimester Check-up (28-34 weeks)' },
      { type: 'ANC-4', weeks: 36, label: 'Pre-term Follow-up & Delivery Plan (36+ weeks)' },
    ];

    for (const anc of ancSchedules) {
      const schedDate = new Date(lmp);
      schedDate.setDate(schedDate.getDate() + anc.weeks * 7);

      await AntenatalAppointment.create({
        appointmentId: `APT-${bId}-${anc.type}`,
        pregnancyRecordId: newRecord._id || newRecord.id,
        beneficiaryId: bId,
        beneficiaryName: villagerName.trim(),
        appointmentType: anc.type,
        scheduledDate: schedDate,
        status: schedDate < new Date() ? 'completed' : 'scheduled',
        facility: healthcareFacility || 'Pentapadu Primary Health Centre (PHC)',
        observations: {
          bloodPressure: '',
          weightKg: 0,
          hemoglobin: 0,
          fundalHeightCm: 0,
          fetalHeartSound: '',
          ifaTabletsDistributed: 0,
          tetanusToxoidDose: '',
        },
        healthcareProviderNotes: anc.label,
        healthWorkerNotes: `Auto-scheduled per National Health Mission guidelines.`,
        isDemoData: false,
      });
    }

    // Create health worker notification
    await Notification.create({
      notificationId: `NOTIF-PREG-${Date.now().toString(36)}`,
      recipientRole: 'health_worker',
      title: {
        en: `New Maternal Record: ${villagerName}`,
        te: `కొత్త గర్భిణీ నమోదు: ${villagerName}`,
      },
      message: {
        en: `Maternal health record registered for ${villagerName} (${householdId}). EDD: ${computedEdd.toLocaleDateString()}. Antenatal appointments scheduled.`,
        te: `${householdId} లోని ${villagerName} గారి గర్భధారణ వివరాలు నమోదయ్యాయి. అంచనా ప్రసవ తేదీ (EDD): ${computedEdd.toLocaleDateString()}.`,
      },
      type: 'maternal_reminder',
      relatedId: bId,
      isRead: false,
      createdAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Maternal health record registered successfully with scheduled ANC visits.',
      record: newRecord,
    });
  } catch (err) {
    next(err);
  }
};

export const updatePregnancy = async (req, res, next) => {
  try {
    const { id } = req.params;
    let record = await PregnancyRecord.findOne({ beneficiaryId: id });
    const targetId = record ? (record._id || record.id) : id;

    const updated = await PregnancyRecord.findByIdAndUpdate(targetId, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Record not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Maternal health record updated successfully.',
      record: updated,
    });
  } catch (err) {
    next(err);
  }
};
