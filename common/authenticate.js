const jwt = require("jsonwebtoken");
const Model = require("../models");

module.exports.getToken = (data) =>
  jwt.sign(data, process.env.SECRET_KEY, { expiresIn: "30 days" });

module.exports.verifyToken = (token) =>
  jwt.verify(token, process.env.SECRET_KEY);

module.exports.verify = (...args) => async (req, res, next) => {
  try {
    // console.log(" auth ",req.headers.authorization)
    const roles = [].concat(args).map((role) => role.toLowerCase());
    const token = String(req.headers.authorization || "")
      .replace(/bearer|jwt/i, "")
      .replace(/^\s+|\s+$/g, "");
    let decoded;
    if (token) decoded = this.verifyToken(token);
    let doc = null;
   let role  = "";
    if (!decoded && roles.includes("guest")) {
      role = "guest";
      return next();
    }
    if (roles.includes("user")) {
      role = "user";
      doc = await Model.Users.findOne({
        _id: decoded._id,
        accessToken: token,
        isBlocked: false,
        isDeleted: false,
      });
    }
    if (roles.includes("trainer")) {
      role = "trainer";
      doc = await Model.Trainers.findOne({
        _id: decoded._id,
        accessToken: token,
        isBlocked: false,
        isDeleted: false,
      });
    }
    if (roles.includes("astrologer")) {
      role = "astrologer";
      doc = await Model.Astrologers.findOne({
        _id: decoded._id,
        accessToken: token,
        isBlocked: false,
        isDeleted: false,
      });
    }
    if (roles.includes("admin")) {
      role = "admin";
      doc = await Model.Admins.findOne({
        _id: decoded._id,
        accessToken: token,
        isBlocked: false,
        isDeleted: false,
      });
    }
    if (!doc) throw new Error("INVALID_TOKEN");
    if (role) req[role] = doc.toJSON();
    // proceed next
    next();
  } catch (error) {
    console.error(error);
    const message =
      String(error.name).toLowerCase() === "error"
        ? error.message
        : "UNAUTHORIZED_ACCESS";
    return res.error(401, message);
  }
};
