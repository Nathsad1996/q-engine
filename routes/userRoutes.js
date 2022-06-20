const express = require("express");
const userRoutes = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");
const {
  validateUserLogin,
  validateUserRegistration,
  checkValidation
} = require("../utils/utils");

userRoutes.post(
  "/register",
  validateUserRegistration,
  checkValidation,
  registerUser
);
userRoutes.post("/login", validateUserLogin, checkValidation, loginUser);

module.exports = userRoutes;
