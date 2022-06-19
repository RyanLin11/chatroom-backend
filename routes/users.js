import User from '../schemas/user';

var express = require('express');
var router = express.Router();

router.get('/', async function(req, res, next) {
  let allUsers = await User.find().exec();
  return allUsers;
});

module.exports = router;
