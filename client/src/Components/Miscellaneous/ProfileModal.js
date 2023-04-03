import { 
    IconButton, 
    useDisclosure, 
    ModalBody, 
    ModalContent, 
    ModalHeader, 
    Image, 
    Text, 
    Modal, 
    ModalCloseButton,
    Button, ModalFooter, ModalOverlay 
} from '@chakra-ui/react';
import { AiFillEye } from "react-icons/ai";
import React from 'react';

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      { children ? <span onClick={onOpen}> { children } </span> : (
        <IconButton
            d={{ base: "flex" }}
            icon={<AiFillEye />}
            onClick={onOpen}
        />   
      ) }
        <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
            <ModalContent h="410px">
                <ModalHeader
                    fontSize="40px"
                    fontFamily="Work sans"
                    d="flex"
                    justifyContent="center"
                >
                  {user.name}
                </ModalHeader>
            <ModalCloseButton />
            <ModalBody
                d="flex"
                flexDir="column"
                alignItems="center"
                justifyContent="space-between"
            >
                <Image
                borderRadius="full"
                boxSize="150px"
                src={user.pic}
                alt={user.name}
                />
                <Text
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
                >
                Email: {user.email}
                </Text>
            </ModalBody>
            <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ProfileModal;
