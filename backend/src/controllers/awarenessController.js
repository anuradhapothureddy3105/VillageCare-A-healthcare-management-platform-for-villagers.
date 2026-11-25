import { AwarenessContent } from '../models/index.js';
import { INITIAL_AWARENESS_DATA } from '../data/awarenessData.js';

export const getAwarenessList = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let contents = await AwarenessContent.find({});

    if (contents.length === 0) {
      // Seed default awareness data if empty
      for (const item of INITIAL_AWARENESS_DATA) {
        await AwarenessContent.create(item);
      }
      contents = await AwarenessContent.find({});
    }

    if (category && category !== 'All') {
      contents = contents.filter((c) => c.category === category);
    }

    if (search && search.trim()) {
      const s = search.toLowerCase().trim();
      contents = contents.filter(
        (c) =>
          c.title?.en?.toLowerCase().includes(s) ||
          c.title?.te?.toLowerCase().includes(s) ||
          c.summary?.en?.toLowerCase().includes(s) ||
          c.summary?.te?.toLowerCase().includes(s) ||
          c.category?.toLowerCase().includes(s)
      );
    }

    res.status(200).json({
      success: true,
      count: contents.length,
      contents,
    });
  } catch (err) {
    next(err);
  }
};

export const getAwarenessById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let content = await AwarenessContent.findOne({ contentId: id });
    if (!content) {
      content = await AwarenessContent.findById(id);
    }

    if (!content) {
      return res.status(404).json({ success: false, message: 'Educational content not found.' });
    }

    res.status(200).json({ success: true, content });
  } catch (err) {
    next(err);
  }
};

export const createAwareness = async (req, res, next) => {
  try {
    const contentId = `AWR-${Date.now().toString(36).toUpperCase()}`;
    const newContent = await AwarenessContent.create({
      ...req.body,
      contentId,
    });

    res.status(201).json({
      success: true,
      message: 'Awareness content created successfully.',
      content: newContent,
    });
  } catch (err) {
    next(err);
  }
};

export const updateAwareness = async (req, res, next) => {
  try {
    const { id } = req.params;
    let item = await AwarenessContent.findOne({ contentId: id });
    const targetId = item ? (item._id || item.id) : id;

    const updated = await AwarenessContent.findByIdAndUpdate(targetId, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Content not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Awareness content updated.',
      content: updated,
    });
  } catch (err) {
    next(err);
  }
};
