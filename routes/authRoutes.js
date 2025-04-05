const express = require("express");
const { requestOTP, validateOTP, submitPassword, refreshToken, changePassword } = require("../controllers/authController");

const router = express.Router();

router.post('/request-otp', requestOTP);
router.post('/validate-otp', validateOTP);
router.post('/submit-password', submitPassword);
router.post('/refresh-token', refreshToken);
router.post('/change-password', changePassword);

module.exports = router;
