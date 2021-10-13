const router = require("express").Router();
const UsersRoutes = require("./User");
const AdminRoutes = require("./Admin");
const TrainerRoutes = require("./Trainer");
const AstrologerRoutes = require("./Astrologer");
// const UploadRoutes = require("./Upload");

router.use("/User", UsersRoutes);
router.use("/Admin", AdminRoutes);
router.use("/Trainer", TrainerRoutes);
router.use("/Astrologer", AstrologerRoutes);
// router.use("/Upload", UploadRoutes);

module.exports = router;
