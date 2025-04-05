const express = require("express");
const { createTask, getTasks, getTaskById, updateTask, deleteTask, getTasksByUserId } = require("../controllers/taskController");

const router = express.Router();

const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken);

router.post("/",authorizeRoles('admin'), createTask);
router.get("/",authorizeRoles('admin'), getTasks);
router.get("/user/:userId",authorizeRoles('admin','basic-user'), getTasksByUserId);
router.get("/:id",authorizeRoles('admin','basic-user'), getTaskById);
router.put("/:id",authorizeRoles('admin','basic-user'), updateTask);
router.delete("/:id",authorizeRoles('admin'), deleteTask);

module.exports = router;
