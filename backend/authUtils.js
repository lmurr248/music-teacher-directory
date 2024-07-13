const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

function generateToken(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
}

function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

module.exports = { generateToken, verifyToken };
