const express = require("express");
const { authenticate } = require("../middleware/auth");
const { accessChat, fetchChats, createGroup, renameGroup, removeFromGroup, addToGroup } =
require("../controllers/chatController");

const router = express.Router();

router.route("/").post(authenticate, accessChat);
router.route("/").get(authenticate, fetchChats);
router.route("/group").post(authenticate, createGroup);
router.route("/grouprename").put(authenticate, renameGroup);
router.route("/groupremove").put(authenticate, removeFromGroup);
router.route("/groupadd").put(authenticate, addToGroup);


module.exports = router;