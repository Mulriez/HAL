const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtValidateMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization)
    return res.status(401).json({
      msg: "Unauthorized",
    });
  const bearerHeader = authorization.split(" ");
  const token = bearerHeader[1];
 
  
  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.status(401).json({
        status: "fail",
        err: err,
      });
    } else {
      req.id = decoded.id;
      req.nama = decoded.nama;
      req.email = decoded.email;
      next();
    }
  });
};

module.exports = jwtValidateMiddleware;
