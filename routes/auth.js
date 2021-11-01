const AuthController = require("../controllers/auth");
const router = require("express").Router();
const authService = require("../helpers/jwt")

router.post("/signup", AuthController.registration);
router.post("/login", AuthController.login);
router.post("/logout", authService.verify('user'), AuthController.logout);
router.post("/sendOtp", AuthController.sendOtp);
router.post("/verifyOTP", authService.verify('user'), AuthController.verifyOTP);
router.post("/forgotPassword", AuthController.sendOtp);
router.post("/changePassword",authService.verify('user'), AuthController.changePassword)

module.exports = router;
  