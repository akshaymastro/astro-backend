const router = require("express").Router();
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


router.post("/uploadFile", upload.single("file"), AuthController.uploadFile);

module.exports = router;