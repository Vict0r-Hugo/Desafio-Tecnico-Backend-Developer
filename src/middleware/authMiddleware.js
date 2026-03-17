const jwt = require("jsonwebtoken");

const SECRET = "secretkey";

function authenticateToken(req, res, next) {

  const authHeader = req.headers["authorization"];

  const token = authHeader?.startsWith("Bearer ")
  ? authHeader.split(" ")[1]
  : authHeader;

  if (!token) {
    return res.status(401).json({ error: "Token required" });
  }

  jwt.verify(token, SECRET, (err, user) => {

    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    req.user = user;

    next();

  });

}

module.exports = authenticateToken;