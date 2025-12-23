const jwt = require("jsonwebtoken");
const { model } = require("mongoose");
const userModel = require("../model/user.model");

async function authMiddleware(req, res, next) {
  try {
    let token;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "nahi she Access.!",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel
      .findOne({ _id: decoded.id })
      .select("-password");

    req.user = user;

    next();
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({
      message: "Unauthorized Access.!",
    });
  }
}



module.exports = { authMiddleware};
