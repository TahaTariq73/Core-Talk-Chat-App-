import React from 'react';
import { Box } from "@chakra-ui/layout";
import { useState } from "react";

import Chatbox from "../Components/Chatbox";
import MyChats from "../Components/MyChats";
import SideDrawer from "../Components/Miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden"}}>
      { user && <SideDrawer /> }
      <Box 
        m={2}
        d="flex" 
        justifyContent="space-between"
        w="100%"
        h="88vh"
      >
        { user && <MyChats fetchAgain={fetchAgain} /> }
        { user && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> }        
      </Box>
    </div>
  )
}

export default ChatPage;
