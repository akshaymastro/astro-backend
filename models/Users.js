const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const ObjectId = mongoose.Types.ObjectId;

const UserSchema = new Schema(
  {
    userName: {
      type: String,
      default: "",
    },
    userType: {
      type: String,
      default: "user",
    },
    email: {
      type: String,
      default: "",
      index: true,
    },
    phoneNo: {
      type: String,
      default: "",
    },
    dialCode: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
      index: true,
    },
    confirmPassword: {
      type: String,
      default: "",
      index: true,
    },
    image: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    latitude: {
      type: Number,
      default: 0,
    },
    longitude: {
      type: Number,
      default: 0,
    },
    isProfileSetup: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
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
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({
  location: "2dsphere",
});

UserSchema.index({
  dialCode: 1,
  phoneNo: 1,
});
UserSchema.set("toJSON", {
  getters: true,
  virtuals: true,
});

UserSchema.methods.authenticate = function (password, callback) {
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

UserSchema.pre("save", function (next) {
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) next(err);
    this.password = hash;
    next();
  });
});

module.exports = mongoose.model("Users", UserSchema);
