const jwtHelper = require("../helpers/jwt");
const responseHandler = require("../helpers/response");
const Model = require("../models");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const _sendEmailVerification = async (doc, email) => {
  try {
    if(req.body.userType == "admin"){
      if (!doc){
        return responseHandler.failure(
          res, {
            message: "Document Missing"
          },
          400
        );
      } 
      if (!email) {
        return responseHandler.failure(
          res, {
            message: "Email Missing"
          },
          400
        );
      }
  
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
  
        await Model.Admins.updateOne({
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
      let result = await Model.Admins.updateOne({
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
    }else if(req.body.userType == "user"){
      if (!doc){
        return responseHandler.failure(
          res, {
            message: "Document Missing"
          },
          400
        );
      } 
      if (!email) {
        return responseHandler.failure(
          res, {
            message: "Email Missing"
          },
          400
        );
      }
  
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
  
        await Model.Users.updateOne({
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
      let result = await Model.Users.updateOne({
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
    }else if(req.body.userType == "astrologer"){
      if (!doc){
        return responseHandler.failure(
          res, {
            message: "Document Missing"
          },
          400
        );
      } 
      if (!email) {
        return responseHandler.failure(
          res, {
            message: "Email Missing"
          },
          400
        );
      }
  
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
    }else if(req.body.userType == "trainer"){
      if (!doc){
        return responseHandler.failure(
          res, {
            message: "Document Missing"
          },
          400
        );
      } 
      if (!email) {
        return responseHandler.failure(
          res, {
            message: "Email Missing"
          },
          400
        );
      }
  
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
  
        await Model.Trainers.updateOne({
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
      let result = await Model.Trainers.updateOne({
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
    }    
  } catch (error) {
    console.error("_sendEmailVerification", error);
  }
}

const _sendPhoneVerification = async (doc, dialCode, phoneNo) => {
  try {
    if(req.body.userType == "user"){
      if (!doc){
        return responseHandler.failure(
          res, {
            message: "Document Missing"
          },
          400
        );
      }   
    if (!dialCode) {
      return responseHandler.failure(
        res, {
          message: "dialCode Missing"
        },
        400
      );
    } 
    if (!phoneNo)  return responseHandler.failure(
      res, {
        message: "phoneNo Missing"
      },
      400
    ); 
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

    await Model.Users.updateOne({
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
    }else if(req.body.userType == "trainer"){
      if (!doc){
        return responseHandler.failure(
          res, {
            message: "Document Missing"
          },
          400
        );
      }   
    if (!dialCode) {
      return responseHandler.failure(
        res, {
          message: "dialCode Missing"
        },
        400
      );
    } 
    if (!phoneNo)  return responseHandler.failure(
      res, {
        message: "phoneNo Missing"
      },
      400
    ); 
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

    await Model.Trainers.updateOne({
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
    }else if(req.body.userType == "astrologer"){
      if (!doc){
        return responseHandler.failure(
          res, {
            message: "Document Missing"
          },
          400
        );
      }   
    if (!dialCode) {
      return responseHandler.failure(
        res, {
          message: "dialCode Missing"
        },
        400
      );
    } 
    if (!phoneNo)  return responseHandler.failure(
      res, {
        message: "phoneNo Missing"
      },
      400
    ); 
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
    }
  } catch (error) {
    console.error("_sendPhoneVerification", error);
  }
}

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
    } else if(req.body.userType == "admin"){
      if (req.body.email) {
        criteria.push({
          email: req.body.email
        });
        criteria.push({
          "temp.email": req.body.email
        });
      }
      const doc = await Model.Admins.findOne({
        $or: criteria,
        isDeleted: false,
      });
      if (!doc){
        return responseHandler.failure(
          res, {
            message: "INVALID_CREDENTIALS "
          },
          400
        );
      } 
      await doc.authenticate(req.body.password);
  
      if (req.body.email && !doc.isEmailVerified) {
        return responseHandler.failure(
          res, {
            message: "ACCOUNT_NOT_VERIFIED "
          },
          403
        );
      }
      if (doc.isBlocked) {
        return responseHandler.failure(
          res, {
            message: "ACCOUNT_BLOCKED "
          },
          403
        );
      }
  
      doc.loginCount += 1;
      doc.userToken = jwtHelper.createNewToken(doc);
      doc.deviceToken = req.body.deviceToken;
      doc.deviceType = req.body.deviceType;
      await doc.save();
    }else if (req.body.userType == "astrologer") {
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

const logout = async (req, res, next) => {
  try {
    if (req.body.userType === "trainer") {
      await Model.Trainers.updateOne({
        _id: req.Trainer._id
      }, {
        accessToken: ""
      });
    } else if (req.body.userType === "user") {
      await Model.Users.updateOne({
        _id: req.user._id
      }, {
        accessToken: ""
      });
    } else if (req.body.userType === "astrologer") {
      await Model.Astrologers.updateOne({
        _id: req.astrologer._id
      }, {
        accessToken: ""
      });
    } else if (req.body.userType === "admin") {
      await Model.Admins.updateOne({
        _id: req.admin._id
      }, {
        accessToken: ""
      });
    }else if(req.body.userType != null){
      return responseHandler.failure(
        res, {
          message: "Incorrect userType"
        },
        400
      );
    }
    return responseHandler.data(
      res, {
        message: "ACCOUNT_LOGOUT_SUCCESSFULLY"
      },
      200
    );
  } catch (error) {
    next(error);
  }
};

const sendOtp = async (req, res, next) => {
  try {
    let doc = null;
if(req.body.userType == "user"){
  if (req.body.email) {
    doc = await Model.Users.findOne({
      email: req.body.email.toLowerCase(),
      isDeleted: false,
    });
  } else if (req.body.phoneNo) {
    doc = await Model.Users.findOne({
      dialCode: req.body.dialCode,
      phoneNo: req.body.phoneNo,
      isDeleted: false,
    });
  }
  if (!doc){
    return responseHandler.failure(
      res, {
        message: "ACCOUNT_NOT_FOUND"
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

  // if (req.body.email) await _sendEmailVerification(doc, req.body.email.toLowerCase());
  // if (req.body.dialCode && req.body.phoneNo)
    // await _sendPhoneVerification(doc, req.body.dialCode, req.body.phoneNo);
}else if(req.body.userType == "astrologer"){
  if (req.body.email) {
    doc = await Model.Astrologers.findOne({
      email: req.body.email.toLowerCase(),
      isDeleted: false,
    });
  } else if (req.body.phoneNo) {
    doc = await Model.Astrologers.findOne({
      dialCode: req.body.dialCode,
      phoneNo: req.body.phoneNo,
      isDeleted: false,
    });
  }
  if (!doc){
    return responseHandler.failure(
      res, {
        message: "ACCOUNT_NOT_FOUND"
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

  // if (req.body.email) await _sendEmailVerification(doc, req.body.email.toLowerCase());
  // if (req.body.dialCode && req.body.phoneNo)
    // await _sendPhoneVerification(doc, req.body.dialCode, req.body.phoneNo);
}else if(req.body.userType == "trainer"){
  if (req.body.email) {
    doc = await Model.Trainers.findOne({
      email: req.body.email.toLowerCase(),
      isDeleted: false,
    });
  } else if (req.body.phoneNo) {
    doc = await Model.Trainers.findOne({
      dialCode: req.body.dialCode,
      phoneNo: req.body.phoneNo,
      isDeleted: false,
    });
  }
  if (!doc){
    return responseHandler.failure(
      res, {
        message: "ACCOUNT_NOT_FOUND"
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

  // if (req.body.email) await _sendEmailVerification(doc, req.body.email.toLowerCase());
  // if (req.body.dialCode && req.body.phoneNo)
    // await _sendPhoneVerification(doc, req.body.dialCode, req.body.phoneNo);
}else if (req.body.userType != null) {
  return responseHandler.failure(
    res, {
      message: "Incorrect req.body.userType"
    },
    400
  );
}
return responseHandler.data(
  res, {
    message: "OTP Sent",
    doc
  },
  200
);
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    let doc = null;
    if (req.body.userType == "user"){
      if (req.body.email) {
        doc = await Model.Users.findOne({
          email: req.body.email.toLowerCase(),
          isDeleted: false,
        });
      } else if (req.body.phoneNo) {
        doc = await Model.Users.findOne({
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
  
      if (!doc){
        return responseHandler.failure(
          res, {
            message: "ACCOUNT_NOT_FOUND"
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
      if (req.body.email) {
        if (req.body.secretCode !== doc.tempData.emailSecret)
          return responseHandler.data(
            res, {
              message: "INVALID_OTP",
              doc
            },
            400
          );
        doc.tempData.emailSecret = "";
        doc.tempData.emailSecretExpiry = new Date(0);
        doc.isEmailVerified = true;
      }
  
      if (req.body.phoneNo) {
        if (req.body.secretCode !== doc.tempData.phoneSecretCode)
        return responseHandler.data(
          res, {
            message: "INVALID_OTP",
            doc
          },
          400
        );
        doc.tempData.phoneSecretCode = "";
        doc.tempData.phoneSecretExpiry = new Date(0);
        doc.isPhoneVerified = true;
      }
  
      await doc.save();
  
}else if(req.body.userType == "trainer"){
    if (req.body.email) {
      doc = await Model.Trainers.findOne({
        email: req.body.email.toLowerCase(),
        isDeleted: false,
      });
    } else if (req.body.phoneNo) {
      doc = await Model.Trainers.findOne({
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

    if (!doc){
      return responseHandler.failure(
        res, {
          message: "ACCOUNT_NOT_FOUND"
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
    if (req.body.email) {
      if (req.body.secretCode !== doc.tempData.emailSecret)
      return responseHandler.data(
        res, {
          message: "INVALID_OTP",
          doc
        },
        400
      );
      doc.tempData.emailSecret = "";
      doc.tempData.emailSecretExpiry = new Date(0);
      doc.isEmailVerified = true;
    }

    if (req.body.phoneNo) {
      if (req.body.secretCode !== doc.tempData.phoneSecretCode)
      return responseHandler.data(
        res, {
          message: "INVALID_OTP",
          doc
        },
        400
      );
      doc.tempData.phoneSecretCode = "";
      doc.tempData.phoneSecretExpiry = new Date(0);
      doc.isPhoneVerified = true;
    }

    await doc.save();


}else if(req.body.userType == "astrologer"){
  if (req.body.email) {
    doc = await Model.Astrologers.findOne({
      email: req.body.email.toLowerCase(),
      isDeleted: false,
    });
  } else if (req.body.phoneNo) {
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

  if (!doc){
    return responseHandler.failure(
      res, {
        message: "ACCOUNT_NOT_FOUND"
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
  if (req.body.email) {
    if (req.body.secretCode !== doc.tempData.emailSecret)
    return responseHandler.data(
      res, {
        message: "INVALID_OTP",
        doc
      },
      400
    );
    doc.tempData.emailSecret = "";
    doc.tempData.emailSecretExpiry = new Date(0);
    doc.isEmailVerified = true;
  }

  if (req.body.phoneNo) {
    if (req.body.secretCode !== doc.tempData.phoneSecretCode)
    return responseHandler.data(
      res, {
        message: "INVALID_OTP",
        doc
      },
      400
    );
    doc.tempData.phoneSecretCode = "";
    doc.tempData.phoneSecretExpiry = new Date(0);
    doc.isPhoneVerified = true;
  }

  await doc.save();


}else if (req.body.userType != null) {
  return responseHandler.failure(
    res, {
      message: "Incorrect req.body.userType"
    },
    400
  );
}
    return responseHandler.data(
      res, {
        message: "OTP Verified",
        doc
      },
      200
    );
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
  if(req.body.userType == "admin"){
    if (req.body.oldPassword === req.body.newPassword){
      return responseHandler.failure(
        res, {
          message: "PASSWORDS_SHOULD_BE_DIFFERENT"
        },
        400
      );
    }
  const doc = await Model.Admins.findOne({
    _id: req.user._id
  });
  if (!doc){
    return responseHandler.failure(
      res, {
        message: "ACCOUNT_NOT_FOUND"
      },
      400
    );
  }

  await doc.authenticate(req.body.oldPassword);
  await doc.setPassword(req.body.newPassword);
  await doc.save();
  }else if(req.body.userType == "trainer"){
    if (req.body.oldPassword === req.body.newPassword){
      return responseHandler.failure(
        res, {
          message: "PASSWORDS_SHOULD_BE_DIFFERENT"
        },
        400
      );
    }
  const doc = await Model.Trainers.findOne({
    _id: req.user._id
  });
  if (!doc){
    return responseHandler.failure(
      res, {
        message: "ACCOUNT_NOT_FOUND"
      },
      400
    );
  }

  await doc.authenticate(req.body.oldPassword);
  await doc.setPassword(req.body.newPassword);
  await doc.save();
  }else if(req.body.userType == "astrologer"){
    if (req.body.oldPassword === req.body.newPassword){
      return responseHandler.failure(
        res, {
          message: "PASSWORDS_SHOULD_BE_DIFFERENT"
        },
        400
      );
    }
  const doc = await Model.Astrologers.findOne({
    _id: req.user._id
  });
  if (!doc){
    return responseHandler.failure(
      res, {
        message: "ACCOUNT_NOT_FOUND"
      },
      400
    );
  }

  await doc.authenticate(req.body.oldPassword);
  await doc.setPassword(req.body.newPassword);
  await doc.save();
  }else if(req.body.userType == "user"){
    if (req.body.oldPassword === req.body.newPassword){
      return responseHandler.failure(
        res, {
          message: "PASSWORDS_SHOULD_BE_DIFFERENT"
        },
        400
      );
    }
  const doc = await Model.Users.findOne({
    _id: req.user._id
  });
  if (!doc){
    return responseHandler.failure(
      res, {
        message: "ACCOUNT_NOT_FOUND"
      },
      400
    );
  }

  await doc.authenticate(req.body.oldPassword);
  await doc.setPassword(req.body.newPassword);
  await doc.save();
  }else if (req.body.userType != null) {
    return responseHandler.failure(
      res, {
        message: "Incorrect req.body.userType"
      },
      400
    );
  }
  return responseHandler.data(
    res, {
      message: "Password changed successfully after we change the password"
    },
    200
  );
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    let doc = await Model.Trainers.findOne({
      _id: req.Trainer._id
    }).lean().exec();
    let astro = await Model.Astrologers.findOne({
      _id: req.astrologer._id
    }).lean().exec();
    let usedety
     = await Model.Users.findOne({
      _id: req.user._id
    }).lean().exec();
    return responseHandler.data(
      res, {
        message: "DATA_FETCHED"
      },
      200
    );
  } catch (error) {
    next(error);
  }
};


module.exports = {
  registration,
  login,
  logout,
  sendOtp,
  verifyOtp,
  changePassword,
  getProfile
};