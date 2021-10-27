const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const constants = require('../common/constants')
const ObjectId = mongoose.Schema.Types.ObjectId;

const DocSchema = new Schema(
    {
        userId : {type : ObjectId, ref : 'user'},
        path: { type: String, default: ""},
        status : {type: Number, enum: [constants.POST_TYPE.PENDING, constants.POST_TYPE.COMPLETE], default : constants.POST_TYPE.PENDING}
    },
    { timestamps: true }
);

module.exports = mongoose.model("UploadPost", DocSchema);
