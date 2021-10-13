const router = require("express").Router();
const multer = require("multer");
const aws = require("aws-sdk")
const multerS3 = require('multer-s3');
const Auth = require("../../common/authenticate");
const Controller = require("../controllers");

//  ONBOARDING API'S
router.post("/register", Controller.User.register);
router.post("/login", Controller.User.login);
router.post("/logout", Auth.verify("User"), Controller.User.logout);
router.get("/getProfile", Auth.verify("User"), Controller.User.getProfile);
router.put("/updateProfile", Auth.verify("User"), Controller.User.updateProfile);
router.post("/changePassword", Auth.verify("User"), Controller.User.changePassword);
router.delete("/deleteAccount", Auth.verify("User"), Controller.User.deleteAccount);
router.post("/uploadFile", upload.single("file"), Controller.User.uploadFile);

router.post("/sendOtp", Controller.User.sendOtp);
router.post("/verifyOtp", Controller.User.verifyOtp);
router.post("/checkVerification", Auth.verify("User"), Controller.User.checkVerification);
router.post("/sendEmailVerification", Auth.verify("User"), Controller.User.sendEmailVerification);
router.post("/verifyAccountEmail", Controller.User.verifyAccountEmail);
router.post("/forgotPassword", Controller.User.sendOtp);
router.post("/resetPassword", Controller.User.resetPassword);


module.exports = router;
