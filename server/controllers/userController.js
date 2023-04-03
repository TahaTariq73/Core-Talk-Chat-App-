const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModal");
const generateToken = require("../config/generateToken");

const registerUser = expressAsyncHandler (
    async (req, res) => {
        const { name, email, password, pic } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ error : "Please enter valid credentails" });
        }

        const userIsExist = await User.findOne({ email });

        if (userIsExist) {
            res.status(400).json({ error : "Please enter valid credentails" });
        }

        const user = await User.create({
            name, email, password, pic
        })

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                pic: user.pic,
                token: generateToken(user._id)
            })
        } else {
            res.status(404).json({ error : "User not found" });
        }
    }
)

const loginUser = expressAsyncHandler(
    async (req, res) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                pic: user.pic,
                token: generateToken(user._id)
            })
        } else {
            res.status(404).json({ error : "User not found" });
        }
    }
)

const allUsers = expressAsyncHandler(
    async (req, res) => {
        const keyword = req.query.search ? {
            $or : [
                { name : { $regex: req.query.search, $options : "i" } },
                { email : { $regex: req.query.search, $options : "i" } },                
            ]
        } : {};

        const users = await User.find(keyword).find({ _id : { $ne : req.user._id } });
        res.status(200).json({ users });
    }
)

module.exports = { registerUser, loginUser, allUsers };