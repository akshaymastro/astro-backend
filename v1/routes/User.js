const router = require("express").Router();
const multer = require("multer");
const aws = require("aws-sdk")
const multerS3 = require('multer-s3');
aws.config.update({
    secretAccessKey: 'r2rxKNzUNBzn9KH9XoHtEDcEVAFH13moV+3LjpjX',
    accessKeyId: 'AKIAWBU5UEEJ45RYT3MQ'
});
var s3 = new aws.S3();

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'latestsighting',
        ACL : "public-read",
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    })
});


const Auth = require("../../common/authenticate");
const Controller = require("../controllers");

//  ONBOARDING API'S
router.post("/login", Controller.User.login);
router.post("/logout", Auth.verify("User"), Controller.User.logout);
router.get("/getProfile", Auth.verify("User"), Controller.User.getProfile);
router.put("/updateProfile", Auth.verify("User"), Controller.User.updateProfile);
router.post("/changePassword", Auth.verify("User"), Controller.User.changePassword);
router.delete("/deleteAccount", Auth.verify("User"), Controller.User.deleteAccount);
router.post("/uploadFile", upload.single("file"), Controller.User.uploadFile);

router.post("/sendOtp", Controller.User.sendOtp);
router.post("/verifyOtp", Controller.User.verifyOtp);
router.post("/resetPassword", Controller.User.resetPassword);

module.exports = router;
