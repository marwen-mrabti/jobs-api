const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const isAuth = async (req, res, next) => {
  try {
    //step 1: get auth header
    const authHeader = req.headers.authorization;

    //step 2: check if auth header is undefined or does not start with Bearer
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthenticatedError("Not authenticated");
    }

    //step 3: get token from header
    const token = authHeader.split(" ")[1];

    //step 4: verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //step 5: set user in req
    req.user = { userId: decoded.userId };

    //step 6: call next middleware
    next();
  } catch (error) {
    throw new UnauthenticatedError("Not authenticated");
  }
};

module.exports = {
  isAuth,
};
