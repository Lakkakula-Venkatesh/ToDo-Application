const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/update", authController.update);
router.post("/logout", authController.logout);
router.post("/reset", authController.reset);
router.post("/forgot", authController.generateResetToken);

module.exports = router;
