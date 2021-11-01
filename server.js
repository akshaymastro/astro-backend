const express = require("express");
const cors = require("cors");
const errorHanlder = require("./utils/globalErrorhandler");
const connectDB = require("./config/dbconnect");
const app = express();
const logger = require("morgan");
const bodyParser = require("body-parser");
const v1Routes = require("./routes/index");
connectDB();
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));


app.use("/", express.static(__dirname + "/public"));
app.use("/api/v1", v1Routes);
app.use(errorHanlder);
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());

app.use((error, req, res, next) => {
  console.error(error);
  return res.errorHandler(208, error.message || error);
});
// routes(app);
app.listen(process.env.PORT, () =>
  console.log(`Server is running on ${process.env.PORT}`)
);