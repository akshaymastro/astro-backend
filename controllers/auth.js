const UserModel = require("../models/Users");
const AstrologerModel = require("../models/Astrologers");
const TrainerModel = require("../models/Trainers");
const jwtHelper = require("../helpers/jwt");
const responseHandler = require("../helpers/response");
const bcrypt = require("bcryptjs");

const registration = async (req, res, next) => {
  try {
    let User, Model;
    const { email, userType } = req.body;
    if (userType === "user") {
      Model = UserModel;
      User = await UserModel.findOne({ email });
    } else if (userType === "trainer") {
      Model = TrainerModel;

      User = await TrainerModel.findOne({ email });
    } else {
      Model = AstrologerModel;
      User = await AstrologerModel.findOne({ email });
    }
    if (User) {
      throw Error("Email Should Unique");
    }
    let newUser = await new Model(req.body).save();
    const userToken = jwtHelper.createNewToken(newUser);
    responseHandler.data(
      res,
      { message: "User create Successfully", token: userToken },
      200
    );
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { userType, password, email } = req.body;
    let Model =
      userType === "user"
        ? UserModel
        : userType === "trainer"
        ? TrainerModel
        : AstrologerModel;
    const user = await Model.findOne({ email });
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw Error("Incorrect Password");
    }
    let userToken = jwtHelper.createNewToken(user);

    responseHandler.token(res, usertoken, 200);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  registration,
  login,
};
