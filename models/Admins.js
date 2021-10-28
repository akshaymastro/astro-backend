const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const DocSchema = new Schema(
  {
    email: {
      type: String,
      default: "",
      index: true,
    },
    password: {
      type: String,
      default: "",
      index: true,
    },
    userType: {
      type: String,
      default: "admin",
    },
    image: {
      type: String,
      default: "",
    },
    isProfileSetup: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    accessToken: {
      type: String,
      default: "",
      index: true,
    },
    deviceToken: {
      type: String,
      default: "",
      index: true,
    },
    deviceType: {
      type: String,
      default: "",
      enum: ["", "WEB", "IOS", "ANDROID"],
    },
    secretCode: {
      type: String,
      default: "",
    },
    secretExpiry: {
      type: Date,
      default: 0,
    },
    tempData: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

DocSchema.methods.authenticate = function (password, callback) {
  const promise = new Promise((resolve, reject) => {
    if (!password) reject(new Error("MISSING_PASSWORD"));

    bcrypt.compare(password, this.password, (error, result) => {
      if (!result) reject(new Error("INVALID_PASSWORD"));
      resolve(this);
    });
  });

  if (typeof callback !== "function") return promise;
  promise
    .then((result) => callback(null, result))
    .catch((err) => callback(err));
};

DocSchema.methods.setPassword = function (password, callback) {
  const promise = new Promise((resolve, reject) => {
    if (!password) reject(new Error("Missing Password"));

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) reject(err);
      this.password = hash;
      resolve(this);
    });
  });

  if (typeof callback !== "function") return promise;
  promise
    .then((result) => callback(null, result))
    .catch((err) => callback(err));
};

module.exports = mongoose.model("Admins", DocSchema);
