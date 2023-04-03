import { 
  Box, Text, Button, Tooltip,
  Menu, MenuButton, MenuList, Avatar,
  MenuItem, Drawer, useDisclosure, DrawerOverlay,
  DrawerContent, DrawerHeader, DrawerBody,
  Input, useToast, toast, Spinner
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineSearch, AiFillBell, AiOutlineArrowDown } from "react-icons/ai";
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import axios from 'axios';
import ChatLoading from "../ChatLoading";
import UserListItem from '../Avatar/UserListItem';
import { getSender } from "../../Config/ChatLogics";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();

  const logoutUser = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  }

  const accessChat = async (userId) => {
    setLoadingChat(true);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((e) => e._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();

    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      })
      setLoadingChat(false);
    }
  }

  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      })

      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResults(data.users);

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      })
      setLoading(false);
    }
  }

  return (
    <div>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        p="5px 10px 5px 10px"
      >
        <Tooltip 
          label="Search Users to Chat" 
          hasArrow
          placement="bottom-end"
        >
          <Button variant="ghost" backgroundColor="ghostwhite" onClick={onOpen}>
            <AiOutlineSearch />
            <Text d={{ base: "none", md: "flex" }} px={4}> Search User </Text>
          </Button>
        </Tooltip>

        <Text fontSize="21px" fontWeight="semibold"> Core Talk </Text>

        <div style={{ display: "flex", alignItems: "center" }}>
          <Menu>
            <MenuButton p={2}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <AiFillBell style={{ fontSize: "21px" }} />
            </MenuButton>
            <MenuList pl={12}>  
              {!notification.length && "No new messages"}
              {notification.map(notif => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton 
              as={Button}
              rightIcon={<AiOutlineArrowDown />}
            > 
              <Avatar 
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              >

              </Avatar>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem> My Profile </MenuItem>
              </ProfileModal>
              <MenuItem onClick={logoutUser}> Logout </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay></DrawerOverlay>
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px"> Search Users </DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input 
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}> Go </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResults?.map(user => {
                return <UserListItem 
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              })
            ) }
            {loadingChat && <Spinner ml='auto' d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default SideDrawer;