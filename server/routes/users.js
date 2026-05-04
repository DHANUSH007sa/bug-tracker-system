const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('_id name').lean();
    const sanitizedUsers = users.map((user) => ({ id: user._id, name: user.name }));
    res.json(sanitizedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
