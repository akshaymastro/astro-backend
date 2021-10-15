const mongoose = require("mongoose");
const { MONGODB_URL } = process.env;
const connectDB = async () => {
  try {
    await mongoose.connect(`${MONGODB_URL}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongodbconnected");
  } catch (error) {
    return error;
  }
};

module.exports = connectDB;
