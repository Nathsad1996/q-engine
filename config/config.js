require("dotenv").config();

const config = {
  production: {
    dbUrl: "mongodb://localhost:27017/toptal-quiz",
    port: 5000,
  },
  development: {
    dbUrl: "mongodb://localhost:27017/toptal-quiz",
    port: 5000,
  },
};

module.exports = config[process.env.NODE_ENV];
