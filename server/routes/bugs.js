const express = require('express');
const Bug = require('../models/Bug');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const bugs = await Bug.find()
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role');

    res.json(bugs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, severity, status, assignedTo, project } = req.body;

    if (!title || !project) {
      return res.status(400).json({ message: 'Title and project are required' });
    }

    const bug = await Bug.create({
      title,
      description,
      severity,
      status,
      assignedTo,
      project,
      createdBy: req.user._id,
    });

    await Activity.create({
      bugId: bug._id,
      bugTitle: bug.title,
      action: 'created',
      changedBy: req.user.name,
    });

    res.status(201).json(bug);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role');

    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    res.json(bug);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (!['developer', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only developers and admins can update bugs' });
    }

    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    const oldStatus = bug.status;
    const updates = ['title', 'description', 'severity', 'status', 'assignedTo', 'project'];
    updates.forEach((field) => {
      if (req.body[field] !== undefined) {
        bug[field] = req.body[field];
      }
    });

    if (req.body.status !== undefined && req.body.status !== oldStatus) {
      await Activity.create({
        bugId: bug._id,
        bugTitle: bug.title,
        action: 'status changed',
        changedBy: req.user.name,
        oldValue: oldStatus,
        newValue: req.body.status,
      });
    }

    await bug.save();
    res.json(bug);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete bugs' });
    }

    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    await Activity.create({
      bugId: bug._id,
      bugTitle: bug.title,
      action: 'deleted',
      changedBy: req.user.name,
    });

    await bug.deleteOne();
    res.json({ message: 'Bug deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
