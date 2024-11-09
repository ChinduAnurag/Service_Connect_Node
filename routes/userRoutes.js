const express = require("express");
const {
  signup, verifyOTP, resendOTP, signIn} = require("../controllers/userController");

const router = express.Router();

router.post("/signUp", signup);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/signIn", signIn);

module.exports = router;
