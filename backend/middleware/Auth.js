const jwt = require("jsonwebtoken");
const User = require("../models/User");

const hasRole = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized: Token not provided" });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (req.user.role != "admin") {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }
      return next();
    } catch (err) {
      console.log(err);

      res.status(401).json({ error: err });
    }
  } else {
    res.status(401).json({ error: "No token provided" });
  }
};
module.exports = hasRole;
