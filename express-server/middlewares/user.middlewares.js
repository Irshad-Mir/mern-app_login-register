const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const HttpStatus = require("http-status-codes");

const verifyToken = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (!bearerHeader) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        errors: [{ msg: "Not logged in. Please login." }]
      });
    }

    const bearer = bearerHeader.split(" ");

    if (!bearer[1]) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        errors: [{ msg: "Not logged in. Please login." }]
      });
    }

    req.token = bearer[1];

    jwt.verify(req.token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          errors: [{ msg: "Token expired. Please login." }]
        });
      }

      const user = await User.findOne({ _id: decoded._id });

      if (!user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          errors: [{ msg: "Token expired. Please login." }]
        });
      }

      req.user = user;

      next();
    });
  } catch (err) {
    console.log(err);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      errors: [{ msg: "Internal server error" }]
    });
  }
};

module.exports = { verifyToken };
