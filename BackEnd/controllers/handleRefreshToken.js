
const {
  User
} = require("../models/userModel");

  const { genrateToken } = require("../config/generateToken");

  const { generateRefreshToken } = require("../config/refreshToken")
  const jwt = require("jsonwebtoken");
  const {tokenExpiredError} = require('../Errors/TokenErrors')

const handleRefreshToken = async (req, res) => {
    const { token } = req.body;
  
    if (!token) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }
  
    try {
      const user = await User.findOne({ refreshToken: token });
      if (!user) {
        return res.status(400).json({ message: 'No refresh token present in db or not matched' });
      }
  
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          if (err.name === tokenExpiredError) {
            // Token has expired, generate new access token and refresh token
            const newAccessToken = genrateToken(user._id, user.role);
            const newRefreshToken = generateRefreshToken(user._id, user.role);
            user.refreshToken = newRefreshToken; // Update user's refresh token in database
            user.save(); // Save user changes
            return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
          }
          
         
          return res.status(400).json({ message: 'Invalid refresh token' });
        }
  
        // Refresh Token verification successful, return current access token
        const accessToken = genrateToken(user._id, user.role);
        res.json({ accessToken });
      });
    } catch (error) {
      console.error('Error handling refresh token:', error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };


module.exports = {handleRefreshToken}