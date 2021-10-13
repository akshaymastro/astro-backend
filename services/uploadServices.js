const router = require("express").Router();
const multer = require("multer");
const aws = require("aws-sdk")
const multerS3 = require('multer-s3');
aws.config.update({
    secretAccessKey: '',
    accessKeyId: ''
});
var s3 = new aws.S3();

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: '',
        ACL : "public-read",
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    })
});
