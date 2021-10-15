const responseHelper = require("../helpers/response");

const errorCode = (error) => {
  let code = 400;
  switch (error.name) {
    case "ValidationError":
      code = 422;
      break;
    case "Server Error":
      code = 500;
      break;
    case "JsonWebTokenError":
    case "unauthorized":
      code = 401;
      break;
    default:
      break;
  }
  return code;
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  const code = errorCode(error);
  console.log(code, "code");
  console.log(error, "err");
  // console.log(responseHelper.failure(res, error, code))
  return responseHelper.failure(res, error, code);
};

module.exports = errorHandler;
