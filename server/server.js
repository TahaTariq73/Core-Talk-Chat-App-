const express = require("express");
const connectToMongo = require("./config/db");
const cors = require("cors");
const dotenv = require('dotenv');
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());

// Connecting to Mongo Database
connectToMongo();

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ------------ Deployment ------------

const root = path.join(__dirname, 'client', 'build');

if (process.env.NODE_ENV === "production") {
  app.use(express.static(root));

  app.get("*", (req, res) => {
    res.sendFile('index.html', { root })
  })
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  })
}

// ------------ Deployment ------------

const server = app.listen(PORT, () => {
    console.log(`Server started on PORT:${PORT}`);
})

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
})

io.on("connection", (socket) => {
    console.log("Connected with socket io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    })

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log(`User join the room : ${room}`);
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));  

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("User not defined");

        chat.users.forEach(user => {
            if (user._id == newMessageRecieved.sender._id) return;
        
            socket.in(user._id).emit("message recieved", newMessageRecieved);
        })
    })

    socket.off("setup", (userData) => {
        socket.leave(userData._id);
    })
})
