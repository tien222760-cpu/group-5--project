const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { signup, login, logout } = require("../controllers/authController");

router.get("/", userController.getUsers);
router.post("/", userController.addUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
