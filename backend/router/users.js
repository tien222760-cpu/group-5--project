const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// GET /users
router.get("/", userController.getUsers);

// POST /users
router.post("/", userController.addUser);

module.exports = router;
