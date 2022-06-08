const express = require("express");
const auth = require("../auth");
const isToken = require("../auth");

const router = express.Router();

const {
  register,
  verifyOTP,
  login,
  adminLogin,
  userContext,
} = require("./userService");

router.post("/register", register);
router.post("/verify_otp", verifyOTP);
router.post("/login", login);
router.post("/admin/login", adminLogin);
router.get("/userContext", auth.required, auth.user, userContext);

module.exports = router;
