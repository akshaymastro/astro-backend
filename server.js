const express = require("express");
const cors = require("cors");
const errorHanlder = require("./utils/globalErrorhandler");
const connectDB = require("./config/dbconnect");
const routes = require("./routes");
const app = express();
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use("/", express.static(__dirname + "/public"));
app.use(cors());
routes(app);
app.use(errorHanlder);
app.listen(process.env.PORT, () =>
  console.log(`Server is running on ${process.env.PORT}`)
);
