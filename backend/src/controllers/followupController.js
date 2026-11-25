import { FollowUp } from '../models/index.js';

export const getFollowUps = async (req, res, next) => {
  try {
    const { status, targetType } = req.query;
    let query = {};
    if (status) query.status = status;
    if (targetType) query.targetType = targetType;

    const followups = await FollowUp.find(query);
    res.status(200).json({ success: true, count: followups.length, followups });
  } catch (err) {
    next(err);
  }
};

export const createFollowUp = async (req, res, next) => {
  try {
    const { targetType, referenceId, householdId, beneficiaryName, dueDate, remarks } = req.body;

    if (!targetType || !referenceId || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Target type, reference ID, and due date are required.',
      });
    }

    const followUpId = `FLP-${Date.now().toString(36).slice(-5).toUpperCase()}`;

    const newFollowUp = await FollowUp.create({
      followUpId,
      targetType,
      referenceId,
      householdId: householdId || '',
      beneficiaryName: beneficiaryName || '',
      assignedTo: req.user ? req.user.fullName : 'ASHA Worker',
      dueDate: new Date(dueDate),
      status: 'pending',
      remarks: remarks || '',
      isDemoData: false,
    });

    res.status(201).json({
      success: true,
      message: 'Follow-up created successfully.',
      followUp: newFollowUp,
    });
  } catch (err) {
    next(err);
  }
};

export const updateFollowUp = async (req, res, next) => {
  try {
    const { id } = req.params;
    let flp = await FollowUp.findOne({ followUpId: id });
    const targetId = flp ? (flp._id || flp.id) : id;

    const updates = { ...req.body };
    if (updates.status === 'completed' && !updates.completedDate) {
      updates.completedDate = new Date();
    }

    const updated = await FollowUp.findByIdAndUpdate(targetId, updates, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Follow-up not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Follow-up record updated.',
      followUp: updated,
    });
  } catch (err) {
    next(err);
  }
};
