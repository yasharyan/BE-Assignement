const User = require("../model/user_model");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken;
    const verifyToken = jwt.verify(token, process.env.SERCETE_KEY);
    const user = await User.findOne({
      _id: verifyToken._id,
    });
    if (!user) {
      throw new Error("User not found");
    }
    req.token = token;
    req.user = user;
    req.userId = user._id;
    next();
  } catch (e) {
    res.status(401).send("No token provided");
  }
};

module.exports = auth;
