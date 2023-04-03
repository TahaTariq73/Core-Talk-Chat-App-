const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModal");

const accessChat = expressAsyncHandler(
    async (req, res) => {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error : "User Id not send with parameters" });
        }

        let isChat = await Chat.find({ 
            isGroupChat : false,
            $and : [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } }          
            ] 
        }).populate("users", "-password").populate("latestMessage");
    
        isChat = await User.populate(isChat, {
            path : "latestMessage.sender",
            select : "name pic email"
        })

        if (isChat.length > 0) {
            res.status(200).json(isChat[0]);
        } else {
            const chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId],
            }
          
            try {
                const createdChat = await Chat.create(chatData);
                const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                  "users",
                  "-password"
                )
                res.status(200).json(FullChat);
            
            } catch (error) {
                res.status(400).json({ error : error.message });
            }          
        }
    }
)

const fetchChats = expressAsyncHandler(
    async (req, res) => {
        try {
            Chat.find({ users : { $elemMatch : { $eq : req.user._id } }})
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                })
                res.status(200).json(results);
            })
        } catch (error) {
            res.status(400).json({ error : error.message });
        }
    }
)

const createGroup = expressAsyncHandler(
    async (req, res) => {
        if (!req.body.users || !req.body.name) {
            return res.status(400).json({ message: "Please Fill all the feilds" });
        }
        
        let users = JSON.parse(req.body.users);
        
        if (users.length < 2) {
            return res.status(400).send("More than 2 users are required to form a group chat");
        }

        Array(users).forEach(element => {
            if (element === req.user._id) {
                return res.status(400).send("You can't add yourself in your own group");
            }
        })
        
        users.push(req.user);
        
        try {
            const groupChat = await Chat.create({
              chatName: req.body.name,
              users: users,
              isGroupChat: true,
              groupAdmin: req.user,
            })
        
            const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
                .populate("users", "-password")
                .populate("groupAdmin", "-password");
        
            res.status(200).json(fullGroupChat);
        } catch (error) {
            res.status(400).json({ error : error.message });
        }
    } 
)

const renameGroup = expressAsyncHandler(
    async (req, res) => {
        const { chatId, chatName } = req.body;

        const updatedChat = await Chat.findByIdAndUpdate(chatId,
        { chatName: chatName },
        { new: true }).populate("users", "-password")
        .populate("groupAdmin", "-password");

        if (!updatedChat) {
            res.status(404).json({ error : "Chat Not Found" });
        } else {
            res.json(updatedChat);
        }
    }
)

const removeFromGroup = expressAsyncHandler(
    async (req, res) => {
        const { chatId, userId } = req.body;
    
        const removed = await Chat.findByIdAndUpdate(chatId,
        { $pull: { users: userId } },
        { new: true }).populate("users", "-password")
        .populate("groupAdmin", "-password");
          
        if (!removed) {
            res.status(404).json({ error : "Chat Not Found" });
        } else {
            res.json(removed);
        }
    }
)

const addToGroup = expressAsyncHandler(
    async (req, res) => {
        const { chatId, userId } = req.body;

        const added = await Chat.findByIdAndUpdate(chatId,
        { $push: { users: userId } },
        { new: true }).populate("users", "-password")
        .populate("groupAdmin", "-password");

        if (!added) {
            res.status(404).json({ error : "Chat Not Found" });
        } else {
            res.json(added);
        }
    } 
)

module.exports = { accessChat, fetchChats, createGroup, renameGroup, removeFromGroup, addToGroup };