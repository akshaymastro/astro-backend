const AuthController = require("../controllers/auth");
const router = require("express").Router();

router.post("/signup", AuthController.registration);
router.post("/login", AuthController.login);

module.exports = router;
