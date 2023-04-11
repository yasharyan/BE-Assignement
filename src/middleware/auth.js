const User = require("../model/user_model");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken;
    const verifyToken = jwt.verify(token, process.env.SERCETE_KEY);
    const user = await User.findOne({
      _id: verifyToken.id,
    });
    if (!user) {
      throw new Error({ error: "User not found" });
    }
    next();
  } catch (e) {
    res.status(401).send({ error: "No token provided" });
  }
};

module.exports = auth;
