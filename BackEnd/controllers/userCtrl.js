const {
  User,
  validateLogin,
  validateUser,
} = require("../models/userModel");
const { ValidationErrors } = require("../utilities/handleValidation")
const _ = require("lodash");
const asyncHandler = require("express-async-handler");
const { genrateToken } = require("../config/generateToken");
const { userNotFound } = require("../utilities/handleUserNotFound")
const { generateRefreshToken } = require("../config/refreshToken")
const jwt = require("jsonwebtoken");
const {tokenExpiredError} = require('../Errors/TokenErrors')



const createUser = asyncHandler(async (req, res) => {

  const { error } = validateUser(req.body);
  ValidationErrors(error, res);

  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return res.status(400).json({
      message: "A user with this email already exists",
      success: false,
    });
  }

  const newUser = new User(
    _.pick(req.body, ["firstName", "lastName", "address", "mobile", "email", "password"])
  );

  await newUser.save();

  const token = genrateToken(newUser?._id, newUser?.role);

  // res.header("Authorization", `Bearer ${token}`);
  // res.header("x-auth-token", token); // Set header before sending data

  // Now you can send the response body using various methods:
  res.json({ token, user: _.pick(newUser, ["_id", "role"]) });

});

// const loginUser = asyncHandler(async (req, res) => {

//   const { error } = validateLogin(req.body);
//   ValidationErrors(error, res);

//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if (!user || !(await user.isPasswordMatched(password))) {
//     return res.status(400).json({ message: "Invalid email or password" });
//   }
//   else {
//     res.json({ token: genrateToken(user?._id, user?.role) });
//   }

// });




const loginUser = asyncHandler(async (req, res) => {
  const { error } = validateLogin(req.body);
  ValidationErrors(error, res);

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.isPasswordMatched(password))) {
    return res.status(400).json({ message: "Invalid email or password" });
  } 
  else {

    const accessToken = genrateToken(user?._id, user?.role);
    const refreshToken = generateRefreshToken(user?._id,user?.role);
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days (in milliseconds)

    // });
   await User.findByIdAndUpdate(
      user._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );


    res.json({ accessToken,refreshToken });
  }
});

// const handleRefreshToken = async (req, res) => {
//   const { token } = req.body;

//   if (!token) {
//     return res.status(400).json({ message: 'Refresh token is required' });
//   }

//   try {
//     const user = await User.findOne({ refreshToken: token });
//     if (!user) {
//       return res.status(400).json({ message: 'No refresh token present in db or not matched' });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         if (err.name === tokenExpiredError) {
//           // Token has expired, generate new access token and refresh token
//           const newAccessToken = genrateToken(user._id, user.role);
//           const newRefreshToken = generateRefreshToken(user._id, user.role);
//           user.refreshToken = newRefreshToken; // Update user's refresh token in database
//           user.save(); // Save user changes
//           return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
//         }
        
       
//         return res.status(400).json({ message: 'Invalid refresh token' });
//       }

//       // Token verification successful, return current access token
//       const accessToken = genrateToken(user._id, user.role);
//       res.json({ accessToken });
//     });
//   } catch (error) {
//     console.error('Error handling refresh token:', error);
//     res.status(500).json({ message: 'Something went wrong' });
//   }
// };






const getAllUser = async (req, res) => {

  // const users = await User.countDocuments(); //Get Count of Users
  const users = await User.find();
  res.json(users);

};

const getUser = asyncHandler(async (req, res) => {

  const user = await User.findById(req.params.id);

  if (!user) return userNotFound(res);

  res.json(user);

});

const updateUser = async (req, res) => {

  const { error } = validateUser(req.body);

  ValidationErrors(error, res);

  const { firstName, lastName, address, email, password, mobile } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      firstName,
      lastName,
      address,
      email,
      password,
      mobile,

    },
    { new: true }
  );

  if (!user) return userNotFound(res);

  res.status(200).json({ message: "User updated successfully " });

};

const deleteUser = async (req, res) => {

  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) return userNotFound(res);


  res.status(200).json({ message: "User deleted successfully" });

};


const toggleBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return userNotFound(res);


    user.isBlocked = !user.isBlocked;
    await user.save();


    return res.json({ message: user.isBlocked ? "User is blocked" : "User is unblocked" });

  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};


module.exports = {
  createUser,
  loginUser,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
  toggleBlock,
};
