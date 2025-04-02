const express = require("express");
const { createUser, getUsers, getUserById, updateUser, deleteUser, getUsersDropdown} = require("../controllers/userController");

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/dropdown", getUsersDropdown);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
