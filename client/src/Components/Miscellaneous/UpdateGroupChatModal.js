import React, { useState } from 'react';
import {
    Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalFooter, ModalBody,
    ModalCloseButton, useDisclosure, Button,
    IconButton, useToast, Box, FormControl,
    Input, Spinner
} from '@chakra-ui/react';
import { AiFillEye } from "react-icons/ai";
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../Avatar/UserBadgeItem';
import UserListItem from '../Avatar/UserListItem';
import axios from "axios";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, user } = ChatState();
  const toast = useToast();

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
        toast({
          title: "Only admins can remove someone!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        })
        return;
    }
  
    try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }

        console.log(selectedChat, user1);
        const { data } = await axios.put(
          `/api/chat/groupremove`,
          {
            chatId: selectedChat._id,
            userId: user1._id,
          },
          config
        )
  
        user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
        fetchMessages();
        
    } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Some kind of error occured",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        })
        setLoading(false);
    }

    setGroupChatName("");
  }
  

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
        toast({
          title: "User Already in group!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
    }
  
    if (selectedChat.groupAdmin._id !== user._id) {
        toast({
          title: "Only admins can add someone!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
    }

    try {
        setLoading(true);
        const config = {
            headers: {
            Authorization: `Bearer ${user.token}`,
            },
        }

        const { data } = await axios.put(
            `/api/chat/groupadd`,
            {
            chatId: selectedChat._id,
            userId: user1._id,
            },
            config
        )

        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
    } catch (error) {
        toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        })

        setLoading(false);    
    }
    setGroupChatName("");
  }

  const handleSearch = async (query) => {
    setSearch(query);

    if (!query) {
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers : {
          Authorization : `Bearer ${user.token}`
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
    }
  }

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
        setRenameLoading(true);

        const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
        }
          
        const { data } = await axios.put("/api/chat/grouprename",
            {
              chatId: selectedChat._id,
              chatName: groupChatName,
            },
            config
        )

        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setRenameLoading(false);
    
    } catch (error) {
        toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          })
        setRenameLoading(false);
    }
    setGroupChatName("");
  }

  return (  
    <>
      <IconButton 
        d={{ base: "flex" }}
        icon={<AiFillEye />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> {selectedChat.chatName} </ModalHeader>
          <ModalCloseButton />

          <ModalBody d="flex" flexDir="column" alignItems="center">
            <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
              {
                selectedChat.users.map((user) => (
                  <UserBadgeItem 
                    key={user._id}
                    user={user}
                    handleFunction={() => handleRemove(user)}
                  />
                ))
              }
            </Box>
            <FormControl d="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResults?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleRemove(user)}>
              Leave Group 
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal;