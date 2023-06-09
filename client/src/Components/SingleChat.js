import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, IconButton, Spinner, Text, FormControl, Input, useToast } from '@chakra-ui/react';
import { AiOutlineArrowLeft } from "react-icons/ai";
import { getSender } from '../Config/ChatLogics';
import ProfileModal from "./Miscellaneous/ProfileModal";
import { getSenderDetails } from '../Config/ChatLogics';
import UpdateGroupChatModal from './Miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import "./styles.css";
import ScrollableChat from './ScrollableChat';
import { io } from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../Animations/typing.json";

const ENDPOINT = "http://localhost:5000/";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      setLoading(true);

      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);

      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
    }
  }

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }

        setNewMessage("");
        const { data } = await axios.post("/api/message", {
          content : newMessage,
          chatId : selectedChat._id
        }, config)

        
        setMessages([...messages, data]);
        socket.emit("new message", data);
        socket.emit("stop typing", selectedChat._id);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        })
      }
    }
  }

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  }

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);

    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, [])

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {  
        setMessages([...messages, newMessageRecieved]);
      }
    })
  })

  return (
    <>
      {
        selectedChat ? (
          <>
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              pb={3}
              px={2}
              w="100%"
              fontFamily="Work sans"
              d="flex"
              justifyContent={{ base: "space-between" }}
              alignItems="center"
            >
              <IconButton
                d={{ base: "flex", md: "none" }}
                icon={<AiOutlineArrowLeft />}
                onClick={() => setSelectedChat("")}
              />
              {
                !selectedChat.isGroupChat ? (
                  <>
                    {getSender(user, selectedChat.users)}
                    <ProfileModal user={getSenderDetails(user, selectedChat.users)} />
                  </>
                ) : (
                  <>
                    {selectedChat.chatName.toUpperCase()}
                    {
                      <UpdateGroupChatModal
                        fetchAgain={fetchAgain} 
                        setFetchAgain={setFetchAgain}
                        fetchMessages={fetchMessages}
                      />                        
                    }
                  </>
                )
              }
            </Text>
            <Box
              d="flex"
              flexDir="column"
              justifyContent="flex-end"
              p={3}
              bg="#E8E8E8"
              w="100%"
              h="100%"
              borderRadius="lg"
              overflowY="hidden"
            >
              { loading ? 
                <Spinner 
                  size="xl"
                  w={20}
                  h={20}
                  alignSelf="center"
                  margin="auto"
                /> : 
                <>
                  <div className="messages">
                    <ScrollableChat messages={messages} />
                  </div>
                </> 
              }

              
            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {isTyping ? <div>
                <Lottie 
                  options={defaultOptions}
                  width={120}
                  style={{ marginBottom: 15, marginLeft: 0 }}
                />
              </div> : "" }
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
            </Box>
          </>
        ) : (
          <Box d="flex" alignItems="center" justifyContent="center" h="100%">
            <Text fontSize="3xl" pb={3} fontFamily="Work sans" fontWeight="semibold">
              Click on a user to start chatting
            </Text>
          </Box>
        )
      }
    </>
  )
}

export default SingleChat;
