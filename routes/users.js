const { userSchema, updateUserSchema } = require('../validation/users');
const validate = require('../validation/validator');
const { isAuthenticated } = require('../utils/auth');
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.route('/')
  .get(UserController.getAllUsers)
  .post(validate(userSchema), UserController.createUser);

router.route('/:userId')
  .all(isAuthenticated)
  .get(UserController.getUser)
  .put(validate(updateUserSchema), UserController.editUser)
  .delete(UserController.deleteUser);

module.exports = router;
