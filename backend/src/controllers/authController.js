import bcrypt from 'bcryptjs';
import { User, ConsentRecord } from '../models/index.js';
import { generateToken } from '../middleware/auth.js';

export const register = async (req, res, next) => {
  try {
    const { username, password, fullName, role, phone, householdId, consentGiven } = req.body;

    if (!username || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Username, password and full name are required.',
      });
    }

    const existingUser = await User.findOne({ username: username.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this username already exists.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username: username.toLowerCase().trim(),
      password: hashedPassword,
      fullName: fullName.trim(),
      role: role || 'villager',
      phone: phone || '',
      householdId: householdId || '',
      consentGiven: consentGiven !== undefined ? consentGiven : true,
      consentDate: new Date(),
    });

    if (consentGiven) {
      await ConsentRecord.create({
        consentId: `CSNT-${Date.now().toString(36)}`,
        villagerName: fullName,
        householdId: householdId || 'PENDING',
        purpose: 'general_records',
        consentType: 'explicit_dpdp_2023',
        consentStatus: 'granted',
        details: 'Consent recorded at user registration under DPDP Act 2023',
        recordedBy: newUser.username,
      });
    }

    const token = generateToken(newUser._id || newUser.id, newUser.role);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: newUser._id || newUser.id,
        username: newUser.username,
        fullName: newUser.fullName,
        role: newUser.role,
        phone: newUser.phone,
        householdId: newUser.householdId,
        consentGiven: newUser.consentGiven,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both username and password.',
      });
    }

    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.',
      });
    }

    const token = generateToken(user._id || user.id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id || user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
        householdId: user.householdId,
        consentGiven: user.consentGiven,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id || user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
        householdId: user.householdId,
        consentGiven: user.consentGiven,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateConsent = async (req, res, next) => {
  try {
    const { consentGiven, requestCorrection, correctionNotes } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updates = {};
    if (consentGiven !== undefined) {
      updates.consentGiven = consentGiven;
      updates.consentDate = new Date();
    }

    await User.findByIdAndUpdate(req.user.id, updates);

    await ConsentRecord.create({
      consentId: `CSNT-UPD-${Date.now().toString(36)}`,
      villagerName: user.fullName,
      householdId: user.householdId || 'SELF',
      purpose: 'general_records',
      consentType: 'explicit_dpdp_2023',
      consentStatus: requestCorrection ? 'correction_requested' : consentGiven ? 'granted' : 'withdrawn',
      details: correctionNotes || (consentGiven ? 'Consent updated to granted' : 'Consent withdrawn by villager'),
      recordedBy: user.username,
    });

    res.status(200).json({
      success: true,
      message: requestCorrection
        ? 'Data correction request submitted successfully. Health worker will review.'
        : 'Consent preferences updated successfully.',
      consentGiven: updates.consentGiven !== undefined ? updates.consentGiven : user.consentGiven,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    const sanitized = users.map((u) => ({
      id: u._id || u.id,
      username: u.username,
      fullName: u.fullName,
      role: u.role,
      phone: u.phone,
      householdId: u.householdId,
      createdAt: u.createdAt,
    }));
    res.status(200).json({ success: true, count: sanitized.length, users: sanitized });
  } catch (err) {
    next(err);
  }
};
