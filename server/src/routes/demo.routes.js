const express = require('express');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', requireAuth, (req, res) => {
  res.json({
    message: 'Protected profile access works.',
    user: req.user,
  });
});

module.exports = router;
