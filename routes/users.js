const User = require('../schemas/user');
const express = require('express');
const router = express.Router();

router.get('/', async function(req, res, next) {
  try {
    let allUsers = await User.find().populate('channels').exec();
    res.send(allUsers);
  } catch (err) {
    next(err);
  }
});

router.get('/:userId', async function(req, res, next) {
  try {
    let user = await User.findById(req.params.userId).exec();
    res.send(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
