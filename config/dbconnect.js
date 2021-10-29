const mongoose = require("mongoose");
const { MONGODB_URL } = process.env;
const connectDB = async () => {
  try {
    await mongoose.connect(`${MONGODB_URL}`, {
      useUnifiedTopology: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    console.log("Mongodbconnected");
  } catch (error) {
    return error;
  }
};

module.exports = connectDB;

