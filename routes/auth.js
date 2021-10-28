const AuthController = require("../controllers/auth");
const router = require("express").Router();

router.post("/signup", AuthController.registration);
router.post("/login", AuthController.login);
router.post("/sendOtp", AuthController.sendOtp);
router.post("/verifyOtp", AuthController.verifyOtp);
router.post("/forgotPassword", AuthController.sendOtp);



module.exports = router;
  