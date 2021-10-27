// const UserModel = require("../models/Users");
// const AstrologerModel = require("../models/Astrologers");
// const TrainerModel = require("../models/Trainers");
const jwtHelper = require("../helpers/jwt");
const responseHandler = require("../helpers/response");
const Model = require("../models");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");


const registration = async (req, res, next) => {
  try {
    let userToken = "";
    if (req.body.userType == "user") {
      if (req.body.email) {
        req.body.email = req.body.email.toLowerCase();
        const checkEmail = await Model.Users.findOne({
          email: req.body.email,
          isDeleted: false,
        }).lean();
        if (checkEmail) {
          if (checkEmail.isEmailVerified) {
            return responseHandler.failure(
              res, {
                message: "We already have that Email. Try logging in instead."
              },
              400
            );
          }
        }
      }
      if (req.body.phoneNo) {
        const checkPhone = await Model.Users.findOne({
          phoneNo: req.body.phoneNo,
          dialCode: req.body.dialCode,
          isDeleted: false,
        })
        if (checkPhone) {
          if (!checkPhone.isPhoneVerified) {
            await Model.Users.deleteMany({
              phoneNo: req.body.phoneNo,
              dialCode: req.body.dialCode,
              isDeleted: false,
            })
            const doc = await Model.Users.create(req.body);
            doc.accessToken = await jwtHelper.createNewToken({
              _id: doc._id
            });
            await doc.setPassword(req.body.password);
            await doc.save();
            userToken = jwtHelper.createNewToken(doc);
            return responseHandler.data(
              res, {
                message: "User create Successfully",
                token: userToken
              },
              200
            );
          }
          return responseHandler.failure(
            res, {
              message: "We already have that phone number. Try logging in instead."
            },
            400
          );
        }
      }
      const doc = await Model.Users.create(req.body);
      await doc.setPassword(req.body.password);
      await doc.save();
      userToken = jwtHelper.createNewToken(doc);
    } else if (req.body.userType == "trainer") {
      if (req.body.email) {
        req.body.email = req.body.email.toLowerCase();
        const checkEmail = await Model.Trainers.findOne({
          email: req.body.email,
          isDeleted: false,
        }).lean();
        if (checkEmail) {
          if (checkEmail.isEmailVerified) {
            return responseHandler.failure(
              res, {
                message: "We already have that Email. Try logging in instead."
              },
              400
            );
          }
        }
      }
      if (req.body.phoneNo) {
        const checkPhone = await Model.Trainers.findOne({
          phoneNo: req.body.phoneNo,
          dialCode: req.body.dialCode,
          isDeleted: false,
        })
        if (checkPhone) {
          if (!checkPhone.isPhoneVerified) {
            const del = await Model.Trainers.deleteMany({
              phoneNo: req.body.phoneNo,
              dialCode: req.body.dialCode,
              isDeleted: false,
            })
            const doc = await Model.Trainers.create(req.body);
            doc.accessToken = await jwtHelper.createNewToken({
              _id: doc._id
            });
            await doc.setPassword(req.body.password);
            await doc.save();
            userToken = jwtHelper.createNewToken(doc);
            return responseHandler.data(
              res, {
                message: "User create Successfully",
                token: userToken
              },
              200
            );
          }
          return responseHandler.failure(
            res, {
              message: "We already have that phone number. Try logging in instead."
            },
            400
          );
        }
      }
      const doc = await Model.Trainers.create(req.body);
      await doc.setPassword(req.body.password);
      await doc.save();
      userToken = jwtHelper.createNewToken(doc);
    } else if (req.body.userType == "astrologer") {
      if (req.body.email) {
        req.body.email = req.body.email.toLowerCase();
        const checkEmail = await Model.Astrologers.findOne({
          email: req.body.email,
          isDeleted: false,
        }).lean();
        if (checkEmail) {
          if (checkEmail.isEmailVerified) {
            return responseHandler.failure(
              res, {
                message: "We already have that Email. Try logging in instead."
              },
              400
            );
          }
        }
      }
      if (req.body.phoneNo) {
        const checkPhone = await Model.Astrologers.findOne({
          phoneNo: req.body.phoneNo,
          dialCode: req.body.dialCode,
          isDeleted: false,
        })
        if (checkPhone) {
          if (!checkPhone.isPhoneVerified) {
            const del = await Model.Astrologers.deleteMany({
              phoneNo: req.body.phoneNo,
              dialCode: req.body.dialCode,
              isDeleted: false,
            })
            const doc = await Model.Astrologers.create(req.body);
            await doc.setPassword(req.body.password);
            await doc.save();
            userToken = jwtHelper.createNewToken(doc);
            return responseHandler.data(
              res, {
                message: "User create Successfully",
                token: userToken
              },
              200
            );
          }
          return responseHandler.failure(
            res, {
              message: "We already have that phone number. Try logging in instead."
            },
            400
          );
        }
      }
      const doc = await Model.Astrologers.create(req.body);
      await doc.setPassword(req.body.password);
      await doc.save();
      userToken = jwtHelper.createNewToken(doc);

    } else {
      return responseHandler.failure(
        res, {
          message: "Incorrect userType"
        },
        400
      );
    }
    return responseHandler.data(
      res, {
        message: "User create Successfully",
        token: userToken
      },
      200
    );
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    let userToken = "";
    const criteria = [];
    if (req.body.userType == "user") {
      if (req.body.email) {
        criteria.push({
          email: req.body.email.toLowerCase()
        });
      } else if (req.body.phoneNo && req.body.dialCode) {
        criteria.push({
          phoneNo: req.body.phoneNo,
          dialCode: req.body.dialCode
        });
      }
      let doc = await Model.Users.findOne({
        $or: criteria,
        isDeleted: false
      })
      if (!doc) {
        return responseHandler.failure(
          res, {
            message: "INVALID_CREDENTIALS"
          },
          400
        );
      };
      await doc.authenticate(req.body.password);

      if (req.body.email && !doc.isEmailVerified) {
        return responseHandler.failure(
          res, {
            message: "ACCOUNT_NOT_VERIFIED"
          },
          400
        );
      }
      if (req.body.phoneNo && !doc.isPhoneVerified) {
        return responseHandler.failure(
          res, {
            message: "ACCOUNT_NOT_VERIFIED"
          },
          400
        );
      }
      if (doc.isBlocked) {
        return responseHandler.failure(
          res, {
            message: "ACCOUNT_BLOCKED"
          },
          400
        );
      }
      doc.loginCount += 1;
      doc.deviceToken = req.body.deviceToken;
      doc.deviceType = req.body.deviceType;
      await doc.save();
      userToken = jwtHelper.createNewToken(newUser);
    } else if (req.body.userType == "astrologer") {
      if (req.body.email) {
        criteria.push({
          email: req.body.email.toLowerCase()
        });
      } else if (req.body.phoneNo && req.body.dialCode) {
        criteria.push({
          phoneNo: req.body.phoneNo,
          dialCode: req.body.dialCode
        });
      }
      let doc = await Model.Astrologers.findOne({
        $or: criteria,
        isDeleted: false
      })
      if (!doc) {
        return responseHandler.failure(
          res, {
            message: "INVALID_CREDENTIALS"
          },
          400
        );
      };
      await doc.authenticate(req.body.password);

      if (req.body.email && !doc.isEmailVerified) {
        return responseHandler.failure(
          res, {
            message: "ACCOUNT_NOT_VERIFIED"
          },
          400
        );
      }
      if (req.body.phoneNo && !doc.isPhoneVerified) {
        return responseHandler.failure(
          res, {
            message: "ACCOUNT_NOT_VERIFIED"
          },
          400
        );
      }
      if (doc.isBlocked) {
        return responseHandler.failure(
          res, {
            message: "ACCOUNT_BLOCKED"
          },
          400
        );
      }
      doc.loginCount += 1;
      doc.deviceToken = req.body.deviceToken;
      doc.deviceType = req.body.deviceType;
      await doc.save();
      userToken = jwtHelper.createNewToken(newUser);
    } else if (req.body.userType == "trainer") {
      console.log(req.body, "req.body")
      if (req.body.email) {
        criteria.push({
          email: req.body.email.toLowerCase()
        });
      } else if (req.body.phoneNo && req.body.dialCode) {
        criteria.push({
          phoneNo: req.body.phoneNo,
          dialCode: req.body.dialCode
        });
      }
      let doc = await Model.Trainers.findOne({
        $or: criteria,
        isDeleted: false
      })
      if (!doc) {
        return responseHandler.failure(
          res, {
            message: "INVALID_CREDENTIALS"
          },
          400
        );
      };
      await doc.authenticate(req.body.password);

      if (req.body.email && !doc.isEmailVerified) {
        return responseHandler.failure(
          res, {
            message: "ACCOUNT_NOT_VERIFIED"
          },
          400
        );
      }
      if (req.body.phoneNo && !doc.isPhoneVerified) {
        return responseHandler.failure(
          res, {
            message: "ACCOUNT_NOT_VERIFIED"
          },
          400
        );
      }
      if (doc.isBlocked) {
        return responseHandler.failure(
          res, {
            message: "ACCOUNT_BLOCKED"
          },
          400
        );
      }
      doc.loginCount += 1;
      doc.deviceToken = req.body.deviceToken;
      doc.deviceType = req.body.deviceType;
      await doc.save();
      userToken = jwtHelper.createNewToken(newUser);
    } else if (req.body.userType != null) {
      return responseHandler.failure(
        res, {
          message: "Incorrect req.body.userType"
        },
        400
      );
    }
    return responseHandler.data(
      res, {
        message: "User login Successfully",
        token: userToken
      },
      200
    );
  } catch (e) {
    next(e);
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    if (req.body.userType === Trainer) {
      await Model.Trainers.updateOne({
        _id: req.Trainer._id
      }, {
        accessToken: ""
      });
    } else if (req.body.userType === user) {
      await Model.Users.updateOne({
        _id: req.user._id
      }, {
        accessToken: ""
      });
    } else if (req.body.userType === astrologer) {
      await Model.Astrologers.updateOne({
        _id: req.astrologer._id
      }, {
        accessToken: ""
      });
    } else if (req.body.userType === user) {
      throw Error("Incorrect req.body.userType");
    }

    return res.success("ACCOUNT_LOGOUT_SUCCESSFULLY");
  } catch (error) {
    next(error);
  }
};


module.exports.getProfile = async (req, res, next) => {
  try {
    let doc = await Model.Trainers.findOne({
      _id: req.Trainer._id
    }).lean().exec();
    let doc = await Model.Astrologers.findOne({
      _id: req.astrologer._id
    }).lean().exec();
    let doc = await Model.Users.findOne({
      _id: req.user._id
    }).lean().exec();
    return res.success("DATA_FETCHED", doc);
  } catch (error) {
    next(error);
  }
};

// module.exports.updateProfile = async (req, res, next) => {
//   try {
//     const = {
//       $nin: [req.Trainer._id]
//     };

//     // check other accounts'''''''
//     if (req.body.email) {
//       req.body.email = req.body.email.toLowerCase();
//       const checkEmail = await Model.Trainers.findOne({
//         _id: nin,
//         email: req.body.email,
//         isDeleted: false,
//       });
//       if (checkEmail) throw new Error("EMAIL_ALREADY_IN_USE");
//     }
//     if (req.body.phoneNo) {
//       const checkPhone = await Model.Trainers.findOne({
//         _id: nin,
//         dialCode: req.body.dialCode,
//         phoneNo: req.body.phoneNo,
//         isDeleted: false,
//       });
//       if (checkPhone) throw new Error("Phone number is already exist");
//     }
//     if (req.body.TrainerName) {
//       // req.body.TrainerName = req.body.TrainerName.toLowerCase();
//       const checkTrainerName = await Model.Trainers.findOne({
//         _id: nin,
//         TrainerName: req.body.TrainerName,
//         isDeleted: false,
//       });
//       if (checkTrainerName) throw new Error("TrainerNAME_ALREADY_IN_USE");
//     }
//     let location = {}
//     let coordinates = []
//     if (req.body.latitude && req.body.longitude) {
//       coordinates.push(Number(req.body.longitude))
//       coordinates.push(Number(req.body.latitude))
//       location.type = "Point";
//       location.coordinates = coordinates
//       req.body.location = location;
//     }
//     const email = req.body.email;
//     // const phoneNo = req.body.phoneNo;
//     // const dialCode = req.body.dialCode;

//     delete req.body.email;

//     req.body.isProfileSetup = true;
//     const updated = await Model.Trainers.findOneAndUpdate({
//       _id: req.Trainer._id
//     }, {
//       $set: req.body
//     }, {
//       new: true
//     }).lean().exec();
//     if (updated.interest != null) {
//       let check = await Model.Interest.findOne({
//         _id: ObjectId(updated.interest)
//       })
//       updated.interestName = check.name
//     }
//     // await _sendEmailVerification(updated, email);
//     // if (req.body.email) await _sendEmailVerification(updated, email);
//     // if (req.body.dialCode && req.body.phoneNo) await _sendPhoneVerification(doc, req.body.dialCode, req.body.phoneNo);

//     return res.success("Profile updated successfully", updated);
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = {
  registration,
  login,
};