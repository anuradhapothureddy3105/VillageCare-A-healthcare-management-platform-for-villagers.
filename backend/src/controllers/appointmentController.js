import { AntenatalAppointment, PregnancyRecord, Notification } from '../models/index.js';

export const getAppointments = async (req, res, next) => {
  try {
    const { beneficiaryId, status, type } = req.query;
    let query = {};

    if (beneficiaryId) query.beneficiaryId = beneficiaryId;
    if (status) query.status = status;
    if (type) query.appointmentType = type;

    // Villager role restriction
    if (req.user.role === 'villager') {
      const myRecords = await PregnancyRecord.find({
        $or: [
          { householdId: req.user.householdId },
          { villagerName: { $regex: req.user.fullName, $options: 'i' } },
        ],
      });
      const myBids = myRecords.map((r) => r.beneficiaryId);
      const appointments = await AntenatalAppointment.find({});
      const filtered = appointments.filter((a) => myBids.includes(a.beneficiaryId));
      return res.status(200).json({ success: true, count: filtered.length, appointments: filtered });
    }

    const appointments = await AntenatalAppointment.find(query);

    // Sort by scheduled date
    const sorted = [...appointments].sort(
      (a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate)
    );

    res.status(200).json({
      success: true,
      count: sorted.length,
      appointments: sorted,
    });
  } catch (err) {
    next(err);
  }
};

export const createAppointment = async (req, res, next) => {
  try {
    const {
      beneficiaryId,
      pregnancyRecordId,
      appointmentType,
      scheduledDate,
      facility,
      healthcareProviderNotes,
      healthWorkerNotes,
    } = req.body;

    if (!beneficiaryId || !scheduledDate || !appointmentType) {
      return res.status(400).json({
        success: false,
        message: 'Beneficiary ID, appointment type, and scheduled date are required.',
      });
    }

    const preg = await PregnancyRecord.findOne({ beneficiaryId });
    if (!preg) {
      return res.status(404).json({
        success: false,
        message: 'Maternal health record not found for this beneficiary ID.',
      });
    }

    const appointmentId = `APT-${beneficiaryId}-${Date.now().toString(36).slice(-4).toUpperCase()}`;

    const newAppointment = await AntenatalAppointment.create({
      appointmentId,
      pregnancyRecordId: pregnancyRecordId || (preg._id || preg.id),
      beneficiaryId,
      beneficiaryName: preg.villagerName,
      appointmentType,
      scheduledDate: new Date(scheduledDate),
      status: 'scheduled',
      facility: facility || preg.healthcareFacility,
      observations: {
        bloodPressure: '',
        weightKg: 0,
        hemoglobin: 0,
        fundalHeightCm: 0,
        fetalHeartSound: '',
        ifaTabletsDistributed: 0,
        tetanusToxoidDose: '',
      },
      healthcareProviderNotes: healthcareProviderNotes || '',
      healthWorkerNotes: healthWorkerNotes || '',
      isDemoData: preg.isDemoData !== false,
    });

    res.status(201).json({
      success: true,
      message: 'Antenatal appointment created successfully.',
      appointment: newAppointment,
    });
  } catch (err) {
    next(err);
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    let apt = await AntenatalAppointment.findOne({ appointmentId: id });
    const targetId = apt ? (apt._id || apt.id) : id;

    const updates = { ...req.body };
    if (updates.status === 'completed' && !updates.completedDate) {
      updates.completedDate = new Date();
    }

    const updated = await AntenatalAppointment.findByIdAndUpdate(targetId, updates, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    // If marked missed, create alert notification
    if (updates.status === 'missed') {
      await Notification.create({
        notificationId: `NOTIF-MISSED-${Date.now().toString(36)}`,
        recipientRole: 'health_worker',
        title: {
          en: `Missed Appointment: ${updated.beneficiaryName}`,
          te: `తప్పిన వైద్య పరీక్ష: ${updated.beneficiaryName}`,
        },
        message: {
          en: `${updated.beneficiaryName} missed her ${updated.appointmentType} visit scheduled on ${new Date(updated.scheduledDate).toLocaleDateString()}. Please follow up.`,
          te: `${updated.beneficiaryName} గారు ${new Date(updated.scheduledDate).toLocaleDateString()} నాటి ${updated.appointmentType} తనిఖీకి హాజరుకాలేదు. దయచేసి సంప్రదించండి.`,
        },
        type: 'missed_appointment',
        relatedId: updated.appointmentId,
        isRead: false,
        createdAt: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully.',
      appointment: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    let apt = await AntenatalAppointment.findOne({ appointmentId: id });
    const targetId = apt ? (apt._id || apt.id) : id;

    const deleted = await AntenatalAppointment.findByIdAndDelete(targetId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    res.status(200).json({ success: true, message: 'Appointment record deleted.' });
  } catch (err) {
    next(err);
  }
};
