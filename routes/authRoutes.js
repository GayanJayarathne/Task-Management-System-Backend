const express = require("express");
const { requestOTP, validateOTP, submitPassword } = require("../controllers/authController");

const router = express.Router();

router.post('/request-otp', requestOTP);
router.post('/validate-otp', validateOTP);
router.post('/submit-password', submitPassword);

module.exports = router;
