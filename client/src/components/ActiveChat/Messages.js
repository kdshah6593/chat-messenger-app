import React from "react";
import { Box, Avatar } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

const useStyles = makeStyles(() => ({
  avatar: {
    height: 20,
    width: 20,
    marginRight: 11,
    marginTop: 6,
    float: "right",
  },
}));

const Messages = (props) => {
  const classes = useStyles();
  const { messages, otherUser, userId } = props;

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <>
            <SenderBubble key={message.id} text={message.text} time={time} />
            {props.lastReadMessage(messages, userId) === message.id ? <Avatar alt={otherUser.username} src={otherUser.photoUrl} className={classes.avatar}></Avatar> : ""}
          </>
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
