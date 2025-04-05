const express = require("express");
const { createUser, getUsers, getUserById, updateUser, deleteUser, getUsersDropdown} = require("../controllers/userController");

const router = express.Router();

const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken);

router.post('/', authorizeRoles('admin'), createUser);
router.get('/dropdown',authorizeRoles('admin'),  getUsersDropdown);
router.put('/:id', authorizeRoles('admin'), updateUser);
router.delete('/:id', authorizeRoles('admin'), deleteUser);
router.get('/', authorizeRoles('admin'), getUsers);
router.get('/:id',authorizeRoles('admin'),  getUserById);

module.exports = router;
