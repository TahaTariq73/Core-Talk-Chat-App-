import React from 'react';
import ScrollableFeed from "react-scrollable-feed";
import { Tooltip, Avatar } from '@chakra-ui/react';
import { isLastMessage, isSameSender, isSameUser, isSameSenderMargin } from '../Config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages && messages.map((message, index) => (
        <div style={{ display: "flex" }} key={message._id}>
          {
            (isSameSender(messages, message, index, user._id)
            || isLastMessage(messages, index, user._id)) && (
              <Tooltip
                label={message.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={message.sender.name}
                  src={message.sender.pic}
                />
              </Tooltip>
            )
          }
        <span
          style={{
            backgroundColor: `${
              message.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
            }`,
            marginLeft: isSameSenderMargin(messages, message, index, user._id),
            marginTop: isSameUser(messages, message, index, user._id) ? 3 : 10,
            borderRadius: "20px",
            padding: "5px 15px",
            maxWidth: "75%",
          }}
        >
          {message.content}
        </span>
      </div>
    ))}
  </ScrollableFeed>
)}

export default ScrollableChat;