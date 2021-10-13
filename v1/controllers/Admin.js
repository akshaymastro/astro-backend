const _ = require("lodash");
const Model = require("../../models");
const moment = require("moment");
const Validation = require("../validations");
const Auth = require("../../common/authenticate");
const functions = require("../../common/functions");
const mongoose = require("mongoose");
const constants = require("../../common/constants");
const flatten = require("flat");
const ObjectId = mongoose.Types.ObjectId;
const es = require("event-stream");
const fs = require("fs");


const _sendEmailVerification = async (doc, email) => {
  try {
    if (!doc) throw new Error("Document Missing");
    if (!email) throw new Error("Email Missing");

    doc = JSON.parse(JSON.stringify(doc));
    const tobeUpdated = {};
    if (doc.email && doc.email === email && doc.isEmailVerified === true) {
      tobeUpdated.email = email;
      const token = functions.generateNumber(4);
      tobeUpdated.tempData = Object.assign({}, doc.tempData, {
        email: email,
        emailSecret: token,
        emailSecretExpiry: Date.now() + 60 * 60 * 1e3,
      });

      await Model.Admin.updateOne({
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
      return;
    } else if (!doc.email) {
      tobeUpdated.email = email;
      tobeUpdated.isEmailVerified = false;
    }

    const token = functions.generateNumber(4);

    tobeUpdated.tempData = Object.assign({}, doc.tempData, {
      email: email,
      emailSecret: token,
      emailSecretExpiry: Date.now() + 60 * 60 * 1e3,
    });

    await Model.Admin.updateOne({
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
};


// ONBOARDING API'S
module.exports.login = async (req, res, next) => {
  try {
    await Validation.Admin.login.validateAsync(req.body);

    const criteria = [];
    if (req.body.email) {
      criteria.push({
        email: req.body.email
      });
      criteria.push({
        "temp.email": req.body.email
      });
    }
    const doc = await Model.Admin.findOne({
      $or: criteria,
      isDeleted: false,
    });
    if (!doc) {
      return res.error(403, constants.constant.INVALID_CREDENTIALS);
    }

    await doc.authenticate(req.body.password);

    if (req.body.email && !doc.isEmailVerified) {
      return res.error(403, constants.constant.ACCOUNT_NOT_VERIFIED);
    }
    if (doc.isBlocked) {
      return res.error(403, constants.constant.ACCOUNT_BLOCKED);
    }

    doc.loginCount += 1;
    doc.accessToken = await Auth.getToken({
      _id: doc._id
    });
    doc.deviceToken = req.body.deviceToken;
    doc.deviceType = req.body.deviceType;
    await doc.save();
    return res.success(constants.constant.ACCOUNT_LOGIN_SUCCESSFULLY, doc);
  } catch (error) {
    next(error);
  }
};
module.exports.logout = async (req, res, next) => {
  try {
    await Model.Admin.updateOne({
      _id: req.admin._id
    }, {
      accessToken: ""
    });

    return res.success(constants.constant.ACCOUNT_LOGOUT_SUCCESSFULLY);
  } catch (error) {
    next(error);
  }
};
module.exports.getProfile = async (req, res, next) => {
  try {
    const doc = await Model.Admin.findOne({
      _id: req.admin._id
    });

    return res.success(constants.constant.DATA_FETCHED, doc);
  } catch (error) {
    next(error);
  }
};
module.exports.updateProfile = async (req, res, next) => {
  try {
    await Validation.Admin.updateProfile.validateAsync(req.body);
    const nin = {
      $nin: [req.admin._id]
    };
    // check other accounts
    if (req.body.email) {
      const checkEmail = await Model.Admin.findOne({
        _id: nin,
        email: req.body.email,
        isDeleted: false,
      });
      if (checkEmail) throw new Error(constants.constant.EMAIL_ALREADY_IN_USE);
    }
    if (req.body.phoneNo) {
      const checkPhone = await Model.Admin.findOne({
        _id: nin,
        dialCode: req.body.dialCode,
        phoneNo: req.body.phoneNo,
        isDeleted: false,
      });
      if (checkPhone) throw new Error(constants.constant.PHONE_ALREADY_IN_USE);
    }
    const email = req.body.email;
    req.body.isProfileSetup = true;
    const updated = await Model.Admin.findOneAndUpdate({
      _id: req.admin._id
    }, {
      $set: req.body
    }, {
      new: true
    });

    await _sendEmailVerification(updated, email);
    if (req.body.email) await _sendEmailVerification(updated, email);
    
    return res.success(constants.constant.PROFILE_UPDATED_SUCCESSFULLY, updated);
  } catch (error) {
    next(error);
  }
};
module.exports.changePassword = async (req, res, next) => {
  try {
    await Validation.Admin.changePassword.validateAsync(req.body);

    if (req.body.oldPassword === req.body.newPassword)
      throw new Error(constants.constant.PASSWORDS_SHOULD_BE_DIFFERENT);

    const doc = await Model.Admin.findOne({
      _id: req.admin._id
    });
    if (!doc) throw new Error(constants.constant.ACCOUNT_NOT_FOUND);

    await doc.authenticate(req.body.oldPassword);
    await doc.setPassword(req.body.newPassword);
    await doc.save();

    return res.success(constants.constant.PASSWORD_CHANGED_SUCCESSFULLY);
  } catch (error) {
    next(error);
  }
};

module.exports.sendNewPasswordInEmail = async (req, res, next) => {
  try {
    await Validation.Admin.sendOTP.validateAsync(req.body);
    let doc = null;
    if (req.body.email) {
      doc = await Model.Admin.findOne({
        email: req.body.email,
        isDeleted: false,
      });
    }
    const _sendNewPasswordInEmail = async (doc, email) => {
      try {
        if (!doc) throw new Error("Document Missing");
        if (!email) throw new Error("Email Missing");

        // doc = JSON.parse(JSON.stringify(doc));

        // const token = functions.generateNumber(8);
        const token = "123456789"
        if (!doc) throw new Error(constants.constant.ACCOUNT_NOT_FOUND);
        await doc.setPassword(token);
        await doc.save();
        console.log(token, "password")
        if (token) {
          process.emit("sendEmail", {
            to: email,
            title: "Account New Password",
            message: `Please, use this code address to verify your account - <b>${token}</b>`,
          });
        }
      } catch (error) {
        console.error("_sendNewPasswordInEmail", error);
      }
    };
    if (req.body.email) await _sendNewPasswordInEmail(doc, req.body.email);

    return res.success("New Password Sent");
  } catch (error) {
    next(error);
  }
};
//GET USER WITH PAGINATION

module.exports.getUser = async (req, res, next) => {
  try {
    let page = req.body.page;
    let limit = req.body.limit;
    let search = req.body.search;
    let user = await Model.Users.find({
        isDeleted: false
      })
      .limit(limit)
      .skip(page * limit)
      .sort({
        createdAt: -1
      }).lean().exec();
    let count = await Model.Users.countDocuments({
      isDeleted: false
    });
    if (search != "" && search != null) {
      let UsersList = await Model.Users.find({
        isDeleted: false
      }).sort({
        createdAt: -1
      });
      let finalSearchData = [];
      for (let i = 0; i < UsersList.length; i++) {
        finalSearchData.push({
          firstName: UsersList[i].firstName,
          lastName: UsersList[i].lastName,
          phoneNo: UsersList[i].phoneNo,
          _id: UsersList[i]._id,
          state: UsersList[i].state,
          email: UsersList[i].email
        })
      }
      let dataService = _.filter(finalSearchData, (itm) => {
        const val2Str = Object.values(flatten(itm)).join("");
        return _.includes(val2Str.toLowerCase(), search.toLowerCase());
      });
      if (dataService.length == 0) {
        user = [];
      }
      let result1 = []
      for (let j = 0; j < dataService.length; j++) {
        let serviceData = await Model.Users.findOne(dataService[j])
        if (serviceData != null) {
          result1.push(serviceData)
        }
      }
      let jsonObject = result1.map(JSON.stringify);
      let uniqueSet = new Set(jsonObject);
      let resultData = Array.from(uniqueSet).map(JSON.parse);
      user = resultData;
      count = resultData.length;
    }
    for (let i = 0; i < user.length; i++) {
      let tings = 0;
      let like = 0;
      let comments = 0;
      let checkPost = await Model.AddPost.find({
        userId: user[i]._id,
        postStatus: constants.POST_TYPE.PUBLISH,
        isDeleted: false
      })
      if (checkPost.length > 0) {
        tings = checkPost.length;
        for (let j = 0; j < checkPost.length; j++) {
          if (checkPost[j] != null) {
            like = like + checkPost[j].like;
            comments = comments + checkPost[j].comment
          }
        }
      }
      user[i].tings = tings;
      user[i].like = like;
      user[i].comments = comments;
    }
    return res.success("SUCCESS", {
      user,
      count: count
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    let userId = req.body.userId;
    let user = await Model.Users.findOne({
      _id: ObjectId(userId),
      isDeleted: false
    })
    if (req.body.userId != null) {
      return res.success("SUCCESS", {
        user
      });
    }
    throw new Error("User not found with provided Id.");
  } catch (error) {
    next(error);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    await Validation.Admin.updateUser.validateAsync(req.body);
    req.body.bankDetails = {
      bankName: req.body.bankName || "",
      accountType: req.body.accountType || "",
      accountNumber: req.body.accountNumber || "",
      branchName: req.body.branchName || "",
      branchCode: req.body.branchCode || ""
    }
    const doc = await Model.Users.findOneAndUpdate({
      _id: ObjectId(req.body.userId)
    }, {
      $set: req.body
    }, {
      new: true
    });
    return res.success("PROFILE_UPDATED_SUCCESSFULLY", doc);
  } catch (error) {
    next(error);
  }
};

//GET TRAINER WITH PAGINATION

module.exports.getAllTrainer = async (req, res, next) => {
  try {
    let page = req.body.page;
    let limit = req.body.limit;
    let search = req.body.search;
    let isApprovalList = req.body.isApprovalList  || false;
    let criteria = {
      isDeleted: false
    };
    if(isApprovalList){
      criteria.isApproved = true
    }
    let user = await Model.Trainers.find(criteria)
      .limit(limit)
      .skip(page * limit)
      .sort({
        createdAt: -1
      }).lean().exec();
    let count = await Model.Trainers.countDocuments(criteria);
    if (search != "" && search != null) {
      let TrainersList = await Model.Trainers.find(criteria).sort({
        createdAt: -1
      });
      let finalSearchData = [];
      for (let i = 0; i < TrainersList.length; i++) {
        finalSearchData.push({
          firstName: TrainersList[i].firstName,
          lastName: TrainersList[i].lastName,
          phoneNo: TrainersList[i].phoneNo,
          _id: TrainersList[i]._id,
          state: TrainersList[i].state,
          email: TrainersList[i].email
        })
      }
      let dataService = _.filter(finalSearchData, (itm) => {
        const val2Str = Object.values(flatten(itm)).join("");
        return _.includes(val2Str.toLowerCase(), search.toLowerCase());
      });
      if (dataService.length == 0) {
        user = [];
      }
      let result1 = []
      for (let j = 0; j < dataService.length; j++) {
        let serviceData = await Model.Trainers.findOne(dataService[j])
        if (serviceData != null) {
          result1.push(serviceData)
        }
      }
      let jsonObject = result1.map(JSON.stringify);
      let uniqueSet = new Set(jsonObject);
      let resultData = Array.from(uniqueSet).map(JSON.parse);
      user = resultData;
      count = resultData.length;
    }
    for (let i = 0; i < user.length; i++) {
      let tings = 0;
      let like = 0;
      let comments = 0;
      let checkPost = await Model.AddPost.find({
        userId: user[i]._id,
        postStatus: constants.POST_TYPE.PUBLISH,
        isDeleted: false
      })
      if (checkPost.length > 0) {
        tings = checkPost.length;
        for (let j = 0; j < checkPost.length; j++) {
          if (checkPost[j] != null) {
            like = like + checkPost[j].like;
            comments = comments + checkPost[j].comment
          }
        }
      }
      user[i].tings = tings;
      user[i].like = like;
      user[i].comments = comments;
    }
    return res.success("SUCCESS", {
      user,
      count: count
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getTrainerById = async (req, res, next) => {
  try {
    let userId = req.body.userId;
    let user = await Model.Trainers.findOne({
      _id: ObjectId(userId),
      isDeleted: false
    })
    if (req.body.userId != null) {
      return res.success("SUCCESS", {
        user
      });
    }
    throw new Error("User not found with provided Id.");
  } catch (error) {
    next(error);
  }
};

module.exports.updateTrainer  = async (req, res, next) => {
  try {
    await Validation.Admin.updateUser.validateAsync(req.body);
    req.body.bankDetails = {
      bankName: req.body.bankName || "",
      accountType: req.body.accountType || "",
      accountNumber: req.body.accountNumber || "",
      branchName: req.body.branchName || "",
      branchCode: req.body.branchCode || ""
    }
    const doc = await Model.Trainers.findOneAndUpdate({
      _id: ObjectId(req.body.userId)
    }, {
      $set: req.body
    }, {
      new: true
    });
    return res.success("PROFILE_UPDATED_SUCCESSFULLY", doc);
  } catch (error) {
    next(error);
  }
};
