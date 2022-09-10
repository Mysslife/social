const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeaderToken = req.headers.token;
  if (authHeaderToken) {
    const token = authHeaderToken.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, jwtPayload) => {
      if (err) return res.status(403).json("Invalid Token!");

      req.jwtPayload = jwtPayload;
      next();
    });
  } else {
    return res.status(403).json("You are not authenticated!");
  }
};

const verifyUserToken = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.jwtPayload.isAdmin || req.params.id === req.jwtPayload.id) {
      next();
    } else {
      return res.status(403).json("You are not authenticated!");
    }
  });
};

const verifyAdminToken = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.jwtPayload.isAdmin) {
      next();
    } else {
      return res.status(403).json("You are not authenticated!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyUserToken,
  verifyAdminToken,
};
