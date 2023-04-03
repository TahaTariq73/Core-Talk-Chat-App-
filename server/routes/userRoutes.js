const express = require("express");
const { registerUser, loginUser, allUsers } = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(registerUser).get(authenticate, allUsers);
router.route("/login").post(loginUser);

module.exports = router;