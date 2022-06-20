const { User } = require("../models/users");
const { hashBuilder } = require("../utils/utils");

const authenticateUser = async (req, res, next) => {
  try {
    const { key } = req.query;
    let user = null;
    let hash = "";

    if (key === undefined) {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      hash = hashBuilder(token);
    } else {
      hash = hashBuilder(key);
    }

    user = await User.findOne({ apikey: hash }).select("_id email name").exec();

    if (user === null) {
      return res.json({
        message: "unable to authenticate",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.json({
      message: "authentication failed",
    });
  }
};

module.exports = { authenticateUser };
