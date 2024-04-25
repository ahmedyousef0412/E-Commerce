const jwt = require("jsonwebtoken");

const generateRefreshToken = (id, role) => {
 
  return jwt.sign({ id , role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

module.exports = { generateRefreshToken };
