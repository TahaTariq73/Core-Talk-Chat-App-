import React from 'react';
import { Badge } from '@chakra-ui/react';
import { AiOutlineClose } from "react-icons/ai";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="purple"
      cursor="pointer"
      onClick={handleFunction}
      d="flex"
      alignItems="center"
      fontWeight={500}
      textTransform="capitalize"
    >
      {user.name}
      <AiOutlineClose style={{ paddingLeft: "6px", fontSize: "18px" }} />
    </Badge>
  )
}

export default UserBadgeItem;
