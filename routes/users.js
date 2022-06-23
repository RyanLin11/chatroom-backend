const User = require('../schemas/user');
const express = require('express');
const router = express.Router();

router.get('/', async function(req, res, next) {
  let allUsers = await User.find().exec();
  return allUsers;
});

module.exports = router;
