const {
    User,
    validateLogin,
    validateUser,
    handleError,
} = require("../models/userModel");
const _ = require("lodash");
const asyncHandler = require("express-async-handler");
const { genrateToken } = require("../config/generateToken");
const { authMidd } = require("../middlewares/auth");

const createUser = asyncHandler(async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        handleError(error, res);

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    message: "A user with this email already exists",
                    success: false,
                });
        }

        const newUser = new User(
            _.pick(req.body, ["firstName", "lastName", "mobile", "email", "password"])
        );

        await newUser.save();

        const token = genrateToken(newUser?._id, newUser?.role);

        res.header('x-auth-token', token); // Set header before sending data

        // Now you can send the response body using various methods:
        res.json({ token, user: _.pick(newUser, ['_id', 'role']) });

    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

const loginUser = asyncHandler(async (req, res) => {

    try {
        const { error } = validateLogin(req.body);
        handleError(error, res);

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || !(await user.isPasswordMatched(password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        else {
            res.json({
                token: genrateToken(user?._id, user?.role)
            })
        }
    }
    catch (err) {

        res.status(500).json({ message: "Something went wrong" });
    }

});


const getAllUser = async (req, res) => {
    try {
        // const users = await User.countDocuments(); //Get Count of Users

        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err });
    }
};

const getUser = async (req, res) => {
    try {


        const user = await User.findById(req.params.id);

        if (!user) {
            res.status(404).send(`No User found by id: ${req.params.id}`);
        }
        res.json(user);

    }
    catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};


const updateUser = async (req, res) => {


    try {
        const { error } = validateUser(req.body);

        handleError(error, res);

        const { firstName, lastName, email, password, mobile } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, {

            firstName,
            lastName,
            email,
            password,
            mobile,
        }, { new: true });


        if (!user) return res.status(404).send({ message: 'User not found' });

        res.send(user);
    }

    catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }

};


const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {

        res.status(500).json({ message: 'Something went wrong' });
    }
};


module.exports = {
    createUser,
    loginUser,
    getAllUser: [authMidd, getAllUser]
    , getUser: [authMidd, getUser]
    , updateUser: [authMidd, updateUser]
    , deleteUser: [authMidd, deleteUser]
};
