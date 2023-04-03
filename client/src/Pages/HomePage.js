import React from 'react';
import {
    Box,
    Container,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Login from '../Components/Authentication/Login';
import SignUp from '../Components/Authentication/Signup';

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("userInfo"));
  
      if (user) navigate("/chats");
    }, [navigate]);
  
    
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        shadow="sm"
      >
        <Text fontSize="4xl" fontWeight={700} fontFamily="Work sans"> Mern Talk </Text>
      </Box>

      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px" shadow="sm" marginBottom={50}>
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab> Login </Tab>
            <Tab> Sign Up </Tab>
          </TabList>
          <TabPanels>
            <TabPanel> <Login /> </TabPanel>
            <TabPanel> <SignUp /> </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage;