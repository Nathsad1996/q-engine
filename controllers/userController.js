const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");

const { hashBuilder } = require("../utils/utils");
const { User } = require("../models/users");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const salt = 10;

    // check if email already exists
    const existingUser = await User.find({ email: email });

    if (existingUser.length !== 0) {
      return res.json({
        success: false,
        message: "user with this email already exists!",
      });
    }

    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        return res.json({
          success: false,
          message: "unable to register a new user",
        });
      }

      // generating apiKey & hash it
      const apiKey = uuid();
      const hashedApiKey = hashBuilder(apiKey);

      User.create(
        { name: name, password: hash, email: email, apikey: hashedApiKey },
        (err, user) => {
          if (err) {
            return res.json({
              success: false,
              message: "unable to register a new user",
            });
          }

          return res.json({
            success: true,
            message: "user created successfully, check your apiKey!",
            apiKey: apiKey,
          });
        }
      );
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "an error occur",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      return res.json({
        success: false,
        message: "error, unable to authenticate user",
      });
    }

    if (!result) {
      return res.json({
        success: false,
        message: "bad credential, please retry!",
      });
    }

    return res.json({
      success: true,
      message: "user authenticated successfully",
    });
  });
};

module.exports = { registerUser, loginUser };
