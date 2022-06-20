const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const config = require('./config/config')

require("dotenv").config();

const app = express();
const port = config.port || 5000;

const userRoutes = require("./routes/userRoutes");
const quizRoutes = require("./routes/quizRoutes");

// rateLimit configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, 
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(morgan("common"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(limiter);

app.use("/user", userRoutes);
app.use("/quiz", quizRoutes);

app.use("*", (req, res) => {
  res.json({
    message: "OOps!, there's nothing here",
  });
});

app.listen(port, () => {

  mongoose.connect(config.dbUrl);

  const database = mongoose.connection;

  database.on("error", () => {
    console.log("unable to connect to database");
  });

  database.once("open", () => {
    console.log(`server listen at http://localhost:${port}`);
  });
});
