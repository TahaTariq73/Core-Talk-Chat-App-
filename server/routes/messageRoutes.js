const express = require("express");
const { authenticate } = require("../middleware/auth");
const { sendMessage, fetchMessage } = require("../controllers/messageController");

const router = express.Router();

router.route("/").post(authenticate, sendMessage);
router.route("/:chatId").get(authenticate, fetchMessage);

module.exports = router;