import { Notification, AntenatalAppointment, HealthSurvey, Household } from '../models/index.js';

export const getNotifications = async (req, res, next) => {
  try {
    const userRole = req.user ? req.user.role : 'all';
    const userId = req.user ? req.user.id : null;

    let notifications = await Notification.find({});

    // Filter by recipient role or user ID
    notifications = notifications.filter((n) => {
      if (n.recipientRole === 'all') return true;
      if (n.recipientRole === userRole) return true;
      if (n.recipientUserId && n.recipientUserId === userId) return true;
      return false;
    });

    // Sort descending by date
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    let notif = await Notification.findOne({ notificationId: id });
    const targetId = notif ? (notif._id || notif.id) : id;

    const updated = await Notification.findByIdAndUpdate(
      targetId,
      { isRead: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    res.status(200).json({ success: true, notification: updated });
  } catch (err) {
    next(err);
  }
};

export const createNotification = async (req, res, next) => {
  try {
    const { recipientRole, title, message, type, relatedId } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required.' });
    }

    const newNotif = await Notification.create({
      notificationId: `NOTIF-${Date.now().toString(36)}`,
      recipientRole: recipientRole || 'all',
      title: typeof title === 'object' ? title : { en: title, te: title },
      message: typeof message === 'object' ? message : { en: message, te: message },
      type: type || 'system',
      relatedId: relatedId || '',
      isRead: false,
      createdAt: new Date(),
    });

    res.status(201).json({ success: true, notification: newNotif });
  } catch (err) {
    next(err);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const all = await Notification.find({});
    for (const n of all) {
      await Notification.findByIdAndUpdate(n._id || n.id, { isRead: true });
    }
    res.status(200).json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    next(err);
  }
};
