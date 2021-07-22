import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { useSelector } from "react-redux";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column"
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between"
  }
}));

const ActiveChat = (props) => {
  const classes = useStyles();

  const user = useSelector(state => state.user)
  const conversation = useSelector(state => state.conversations && state.conversations.find(
      (conversation) => conversation.otherUser.username === state.activeConversation
    )) || {};

  const lastReadMessage = (messages, userId) => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].isRead && messages[i].senderId === userId ) {
        return messages[i].id
      }
    }
  }

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            <Messages
              messages={conversation.messages}
              otherUser={conversation.otherUser}
              userId={user.id}
              lastReadMessage={lastReadMessage}
            />
            <Input
              otherUser={conversation.otherUser}
              conversation={conversation}
              conversationId={conversation.id}
              user={user}
              messages={conversation.messages}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ActiveChat;
