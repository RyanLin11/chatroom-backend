const User = require('../schemas/user');
const express = require('express');
const router = express.Router();

router.get('/', async function(req, res, next) {
  try {
    let allUsers = await User.find().exec();
    res.send(allUsers);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
