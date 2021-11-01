const JWT = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRE_TIME } = process.env;
const Model = require("../models");
const responseHandler = require("../helpers/response");

module.exports.getToken = (data) => {
  jwt.sign(data, process.env.SECRET_KEY, { expiresIn: "30 days" });
}

module.exports.createNewToken = (user) => {
  try {
    // console.log(user, "userrr");
    const token = JWT.sign(
      {
        user,
        expiresIn: JWT_EXPIRE_TIME,
      },
      JWT_SECRET
    );
    // console.log(token, "tokennn");
    return token;
  } catch (err) {
    return err;
  }
};

module.exports.resetToken = (id, email) => {
  try {
    const payload = {
      userId: id,
      email: email,
    };
    const token = JWT.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRE_TIME,
    });
    return token;
  } catch (e) {
    return e;
  }
};

module.exports.decryptToken = async (token) => {
  try {
    const decodedToken = await JWT.verify(token, JWT_SECRET);
    return decodedToken;
  } catch (err) {
    return err;
  }
};

module.exports.verify = (...args) => async (req, res, next) => {
  try {
    // console.log(" auth ",req.headers.authorization)
    const roles = [].concat(args).map((role) => role.toLowerCase());
    const token = String(req.headers.authorization || "")
      .replace(/bearer|jwt/i, "")
      .replace(/^\s+|\s+$/g, "");
    let decoded;
    if (token) decoded = await this.decryptToken(token);
    console.log(decoded)
    let doc = null;
   let role  = "";
    if (!decoded && roles.includes("guest")) {
      role = "guest";
      return next();
    }
    if (roles.includes("user")) {
      role = "user";
      doc = await Model.Users.findOne({
        _id: decoded.user.id,
        accessToken: token,
        isBlocked: false,
        isDeleted: false,
      });
      if(!doc){
        role = "trainer"
      }
    }
    if (roles.includes("trainer")) {
      role = "trainer";
      doc = await Model.Trainers.findOne({
        _id: decoded._id,
        accessToken: token,
        isBlocked: false,
        isDeleted: false,
      });
      if(!doc){
        role = "astrologer"
      }
    }
    if (roles.includes("astrologer")) {
      role = "astrologer";
      doc = await Model.Astrologers.findOne({
        _id: decoded._id,
        accessToken: token,
        isBlocked: false,
        isDeleted: false,
      });
      if(!doc){
        role = "admin"
      }
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
    if (!doc) {
      return responseHandler.failure(
        res, {
          message: "INVALID_TOKEN"
        },
        400
      );
    }
    if (role) req[role] = doc.toJSON();
    // proceed next
    next();
  } catch (error) {
    console.error(error);
    const message =
      String(error.name).toLowerCase() === "error"
        ? error.message
        : "UNAUTHORIZED_ACCESS";
        return responseHandler.failure(
          res, {
            message: message
          },
          400
        );
  }
};



