const AuthRoutes = require("./auth");

const initializeRoutes = (app) => {
  app.use("/api/auth", AuthRoutes);
};

module.exports = initializeRoutes;
