const AuthController = require("../controllers/auth");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: "public/uploads",
    filename: function (req, file, cb) {
        const extension = "".concat(file.originalname).split(".").pop();
        const filename = Date.now().toString(36);
        cb(null, `${filename}.${extension}`);
    },
});
const upload = multer({ storage });
const router = require("express").Router();

router.post("/signup", AuthController.registration);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/sendOtp", AuthController.sendOtp);
router.post("/verifyOtp", AuthController.verifyOtp);
router.post("/forgotPassword", AuthController.sendOtp);
router.post("/uploadFile", upload.single("file"), AuthController.uploadFile);


module.exports = router;
  