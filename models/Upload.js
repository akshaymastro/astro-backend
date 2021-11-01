const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const ObjectId = mongoose.Types.ObjectId;
const UploadModel = new Schema({
    admin: {
        id : Schema.ObjectId
    },
    user: {
        id : Schema.ObjectId
    },
    trainer: {
        id : Schema.ObjectId
    },
    astrologer: {
        id : Schema.ObjectId
    },
    image: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("upload", UploadModel);