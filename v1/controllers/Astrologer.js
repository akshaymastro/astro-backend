const _ = require("lodash");
const Model = require("../../models");
const Validation = require("../validations");
const Auth = require("../../common/authenticate");
const functions = require("../../common/functions");
const constants = require("../../common/constants");
const smsService = require("../../services/smsService")
const flatten = require("flat");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const moment = require('moment');

const _sendEmailVerification = async (doc, email) => {
  try {
    if (!doc) throw new Error("Document Missing");
    if (!email) throw new Error("Email Missing");

    doc = JSON.parse(JSON.stringify(doc));
    const tobeUpdated = {};
    // No change, in case - hasEmail, sameEmail, isVerified
    if (doc.email && doc.email === email && doc.isEmailVerified === true) {
      tobeUpdated.email = email;
      const token = await functions.generateNumber(4)
      tobeUpdated.tempData = Object.assign({}, doc.tempData, {
        email: email,
        emailSecret: token,
        emailSecretExpiry: Date.now() + 60 * 60 * 1e3,
      });

      await Model.Astrologers.updateOne({
        _id: doc._id
      }, {
        $set: tobeUpdated
      });

      if (token) {
        process.emit("sendEmail", {
          to: email,
          title: "Verify your account",
          message: `Hello ,Please use this OTP to verify your account - <b>${token}</b>`,
        });
      }
      return;
    } else if (!doc.email) {
      tobeUpdated.email = email;
      tobeUpdated.isEmailVerified = false;
    }
    const token = await functions.generateNumber(4)
    tobeUpdated.tempData = Object.assign({}, doc.tempData, {
      email: email,
      emailSecret: token,
      emailSecretExpiry: Date.now() + 60 * 60 * 1e3,
    });
    let result = await Model.Astrologers.updateOne({
      _id: doc._id
    }, {
      $set: tobeUpdated
    });

    if (token) {
      process.emit("sendEmail", {
        to: email,
        title: "Verify your account",
        message: `Please, use this code address to verify your account - <b>${token}</b>`,
      });
    }
  } catch (error) {
    console.error("_sendEmailVerification", error);
  }
}

const _sendPhoneVerification = async (doc, dialCode, phoneNo) => {
  try {
    if (!doc) throw new Error("Document Missing");
    if (!dialCode) throw new Error("dialCode Missing");
    if (!phoneNo) throw new Error("phoneNo Missing");
    let otp = await functions.generateNumber(4)
    doc = JSON.parse(JSON.stringify(doc));

    const tobeUpdated = {};
    // No change, in case - hasEmail, sameEmail, isVerified
    if (
      doc.phoneNo &&
      doc.dialCode &&
      doc.phoneNo === phoneNo &&
      doc.dialCode === dialCode &&
      doc.isPhoneVerified === true
    ) {
      return;
    } else if (!doc.phoneNo && !doc.dialCode) {
      tobeUpdated.phoneNo = phoneNo;
      tobeUpdated.dialCode = dialCode;
      tobeUpdated.isPhoneVerified = false;
    }

    tobeUpdated.tempData = Object.assign({}, doc.tempData, {
      phoneNo: phoneNo,
      dialCode: dialCode,
      phoneSecretCode: "1234",
      phoneSecretExpiry: Date.now() + 60 * 60 * 1e3,
    });

    await Model.Astrologers.updateOne({
      _id: doc._id
    }, {
      $set: tobeUpdated
    });
    let payload = {
      phoneNo: phoneNo,
      dialCode: dialCode,
      message: `Your verification code is ${otp}`
    }
    await smsService.sendSMSMessage(payload)
  } catch (error) {
    console.error("_sendPhoneVerification", error);
  }
}

module.exports.register = async (req, res, next) => {
  try {
    await Validation.Astrologer.register.validateAsync(req.body);
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
      const checkEmail = await Model.Astrologers.findOne({
        email: req.body.email,
        isDeleted: false,
      }).lean();
      if (checkEmail) {
        if (checkEmail.isEmailVerified) {
          throw new Error("We already have that Email. Try logging in instead.");
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
          const del = await Model.Astrologers.findOneAndDelete({
            phoneNo: req.body.phoneNo,
            dialCode: req.body.dialCode,
            isDeleted: false,
          })
          const doc = await Model.Astrologers.create(req.body);
          doc.accessToken = await Auth.getToken({
            _id: doc._id
          });
          await doc.setPassword(req.body.password);
          await doc.save();

          if (req.body.dialCode && req.body.phoneNo) {
            await _sendPhoneVerification(doc, req.body.dialCode, req.body.phoneNo)
          }
          return res.success("ACCOUNT_CREATED_SUCCESSFULLY", doc);
        }
        throw new Error("We already have that phone number. Try logging in instead.");
      }
    }
    if(req.body.userName) {
      req.body.userName = req.body.userName.toLowerCase();
      const checkUserName = await Model.Astrologers.findOne({
        _id: nin,
        userName: req.body.userName,
        isDeleted: false,
      });
      if (checkUserName) throw new Error("USERNAME_ALREADY_IN_USE");
    }
    const doc = await Model.Astrologers.create(req.body);
    doc.accessToken = await Auth.getToken({
      _id: doc._id
    });
    await doc.setPassword(req.body.password);
    await doc.save();
    // if (req.body.dialCode && req.body.phoneNo) {await _sendPhoneVerification(doc, req.body.dialCode, req.body.phoneNo)}
    if (req.body.email) {
      await _sendEmailVerification(doc, req.body.email)
    };
    
    return res.success("ACCOUNT_CREATED_SUCCESSFULLY", doc);
  } catch (error) {
    next(error);
  }
};


module.exports.login = async (req, res, next) => {
  try {
    await Validation.Astrologer.login.validateAsync(req.body);
    const criteria = [];
    console.log(req.body, "req.body")
    if (req.body.email) {
      criteria.push({
        email: req.body.email.toLowerCase()
      });
      criteria.push({
        "temp.email": req.body.email.toLowerCase()
      });
    } else if (req.body.phoneNo && req.body.dialCode) {
      criteria.push({
        phoneNo: req.body.phoneNo,
        dialCode: req.body.dialCode
      });
      criteria.push({
        "temp.phoneNo": req.body.phoneNo
      });
    }
    let doc = await Model.Astrologers.findOne({
      $or: criteria,
      isDeleted: false,
    })
    if (!doc) throw new Error("INVALID_CREDENTIALS");
    await doc.authenticate(req.body.password);

    if (req.body.email && !doc.isEmailVerified) {
      return res.error(403, "ACCOUNT_NOT_VERIFIED");
    }
    if (req.body.phoneNo && !doc.isPhoneVerified) {
      return res.success("ACCOUNT_NOT_VERIFIED", doc);
    }
    if (doc.isBlocked) {
      return res.error(403, "ACCOUNT_BLOCKED");
    }
    doc.loginCount += 1;
    doc.accessToken = await Auth.getToken({
      _id: doc._id
    });
    doc.deviceToken = req.body.deviceToken;
    doc.deviceType = req.body.deviceType;
    await doc.save();

    if ( req.body.dialCode && req.body.phoneNo) {
     await _sendPhoneVerification (doc, req.body.dialCode ,req.body.phoneNo);
    }
    // if (req.body.email) {
    //   await _sendEmailVerification(doc, req.body.email)
    // };
    return res.success("ACCOUNT_LOGIN_SUCCESSFULLY", doc);
  } catch (error) {
    next(error);
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    await Model.Astrologers.updateOne({
      _id: req.Astrologer._id
    }, {
      accessToken: ""
    });

    return res.success("ACCOUNT_LOGOUT_SUCCESSFULLY");
  } catch (error) {
    next(error);
  }
};

module.exports.getProfile = async (req, res, next) => {
  try {
    let doc = await Model.Astrologers.findOne({
      _id: req.Astrologer._id
    }).lean().exec();
    if (doc.interest != null) {
      let check = await Model.Interest.findOne({
        _id: doc.interest
      })
      doc.interestName = check.name
    }
    const images = await Model.AddPost.find({
      AstrologerId: req.Astrologer._id,
      isDeleted: false
    }).select('images');
    let allImages = [];
    let allImage = [];
    let i;
    if (images.length > 0) {
      for (i = 0; i < images.length; i++) {
        let image = images[i].images;
        allImages.push(image);
      }
      allImage = _.flatten(allImages)
      let jsonObject = allImage.map(JSON.stringify);
      let uniqueSet = new Set(jsonObject);
      let resultData = Array.from(uniqueSet).map(JSON.parse);
      allImage = resultData;
      doc.gallery = allImage
    }
    return res.success("DATA_FETCHED", doc);
  } catch (error) {
    next(error);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    await Validation.Astrologer.updateProfile.validateAsync(req.body);

    const nin = {
      $nin: [req.Astrologer._id]
    };

    // check other accounts
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
      const checkEmail = await Model.Astrologers.findOne({
        _id: nin,
        email: req.body.email,
        isDeleted: false,
      });
      if (checkEmail) throw new Error("EMAIL_ALREADY_IN_USE");
    }
    if (req.body.phoneNo) {
      const checkPhone = await Model.Astrologers.findOne({
        _id: nin,
        dialCode: req.body.dialCode,
        phoneNo: req.body.phoneNo,
        isDeleted: false,
      });
      if (checkPhone) throw new Error("Phone number is already exist");
    }
    if (req.body.AstrologerName) {
      // req.body.AstrologerName = req.body.AstrologerName.toLowerCase();
      const checkAstrologerName = await Model.Astrologers.findOne({
        _id: nin,
        AstrologerName: req.body.AstrologerName,
        isDeleted: false,
      });
      if (checkAstrologerName) throw new Error("AstrologerNAME_ALREADY_IN_USE");
    }
    let location = {}
    let coordinates = []
    if (req.body.latitude && req.body.longitude) {
      coordinates.push(Number(req.body.longitude))
      coordinates.push(Number(req.body.latitude))
      location.type = "Point";
      location.coordinates = coordinates
      req.body.location = location;
    }
    const email = req.body.email;
    // const phoneNo = req.body.phoneNo;
    // const dialCode = req.body.dialCode;

    delete req.body.email;

    req.body.isProfileSetup = true;
    const updated = await Model.Astrologers.findOneAndUpdate({
      _id: req.Astrologer._id
    }, {
      $set: req.body
    }, {
      new: true
    }).lean().exec();
    if (updated.interest != null) {
      let check = await Model.Interest.findOne({
        _id: ObjectId(updated.interest)
      })
      updated.interestName = check.name
    }
    // await _sendEmailVerification(updated, email);
    // if (req.body.email) await _sendEmailVerification(updated, email);
    // if (req.body.dialCode && req.body.phoneNo) await _sendPhoneVerification(doc, req.body.dialCode, req.body.phoneNo);

    return res.success("Profile updated successfully", updated);
  } catch (error) {
    next(error);
  }
};

module.exports.changePassword = async (req, res, next) => {
  try {
    await Validation.Astrologer.changePassword.validateAsync(req.body);

    if (req.body.oldPassword === req.body.newPassword)
      throw new Error("PASSWORDS_SHOULD_BE_DIFFERENT");

    const doc = await Model.Astrologers.findOne({
      _id: req.Astrologer._id
    });
    if (!doc) throw new Error("ACCOUNT_NOT_FOUND");

    await doc.authenticate(req.body.oldPassword);
    await doc.setPassword(req.body.newPassword);
    await doc.save();

    return res.success("Password changed successfully after we change the password");
  } catch (error) {
    next(error);
  }
};

module.exports.deleteAccount = async (req, res, next) => {
  try {
    await Model.Astrologers.updateOne({
      _id: req.Astrologer._id
    }, {
      isDeleted: true
    });

    return res.success("ACCOUNT_DELETED");
  } catch (error) {
    next(error);
  }
};

module.exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) throw new Error("UPLOADING_ERROR");

    // const filePath = "/" + req.file.path.replace(/\/?public\/?/g, "");
    const filePath = req.file;
    const image = filePath.location;

    return res.success("Image uploaded successfully", {
      image
    });
  } catch (error) {
    next(error);
  }
};

module.exports.sendOtp = async (req, res, next) => {
  try {
    await Validation.Astrologer.sendOTP.validateAsync(req.body);
    let doc = null;
    if (req.body.phoneNo) {
      doc = await Model.Astrologers.findOne({
        dialCode: req.body.dialCode,
        phoneNo: req.body.phoneNo,
        isDeleted: false,
      });
    }

    if (!doc) throw new Error("ACCOUNT_NOT_FOUND");
    if (doc.isBlocked) throw new Error("ACCOUNT_BLOCKED");

    if (req.body.dialCode && req.body.phoneNo)
      await _sendPhoneVerification(doc, req.body.dialCode, req.body.phoneNo);

    return res.success("OTP Sent");
  } catch (error) {
    next(error);
  }
};

module.exports.verifyOtp = async (req, res, next) => {
  try {
    await Validation.Astrologer.verifyOTP.validateAsync(req.body);
    let doc = null;
    if (req.body.phoneNo) {
      doc = await Model.Astrologers.findOne({
        $or: [{
            dialCode: req.body.dialCode,
            phoneNo: req.body.phoneNo
          },
          {
            "tempData.dialCode": req.body.dialCode,
            "tempData.phoneNo": req.body.phoneNo,
          },
        ],
        isDeleted: false,
      });
    }

    if (!doc) throw new Error("ACCOUNT_NOT_FOUND");
    if (doc.isBlocked) throw new Error("ACCOUNT_BLOCKED");

    if (req.body.phoneNo) {
      if (req.body.secretCode !== doc.tempData.phoneSecretCode)
        throw new Error("Invalid OTP");
      doc.tempData.phoneSecretCode = "";
      doc.tempData.phoneSecretExpiry = new Date(0);
      doc.isPhoneVerified = true;
    }

    await doc.save();

    return res.success("OTP Verified", doc);
  } catch (error) {
    next(error);
  }
};

module.exports.resetPassword = async (req, res, next) => {
  try {
    await Validation.Astrologer.resetPassword.validateAsync(req.body);

    const doc = await Model.Astrologers.findOne({
      $or: [{
          accessToken: req.body.accessToken
        },
        {
          secretCode: req.body.secretCode
        },
      ],
    });
    if (!doc) throw new Error("ACCOUNT_NOT_FOUND");
    doc.accessToken = "";
    await doc.setPassword(req.body.newPassword);
    await doc.save();
    return res.success("Password reset successfully");
  } catch (error) {
    next(error);
  }
};