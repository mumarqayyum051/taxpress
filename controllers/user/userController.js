const express = require("express");

const router = express.Router();

const { register, verifyOTP, login, adminLogin } = require("./userService");

router.post("/register", register);
router.post("/verify_otp", verifyOTP);
router.post("/login", login);
router.post("/admin/login", adminLogin);

module.exports = router;
