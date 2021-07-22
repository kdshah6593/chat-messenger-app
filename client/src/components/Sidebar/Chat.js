import React from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { useSelector, useDispatch } from "react-redux";

const useStyles = makeStyles({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
});


const Chat = (props) => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch();
  const classes = useStyles();
  
  const handleClick = async (conversation) => {
    let messages = conversation.messages
    let convoId = conversation.id
    let userId = user.id
    let updateConvo = conversation

    await props.updateReadStatus(messages, convoId, userId, updateConvo)
    await dispatch(setActiveChat(conversation.otherUser.username));
  };

  
  const otherUser = props.conversation.otherUser;
  return (
    <Box
      onClick={() => handleClick(props.conversation)}
      className={classes.root}
    >
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={props.conversation} unreadCount={props.conversation.userUnreadMessages} />
    </Box>
  );
}

export default Chat;
