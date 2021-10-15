const jwtHelper = require("../helpers/jwt");
const User = require("../db/models/userSchema");

const authCheck = async (req, res, next) => {
  try {
    const decodedToken = await jwtHelper.decryptToken(
      req.headers.authorization
    );
    if (decodedToken.message) {
      throw decodedToken;
    }
    const user = await User.findById({ _id: decodedToken.id });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authCheck };
