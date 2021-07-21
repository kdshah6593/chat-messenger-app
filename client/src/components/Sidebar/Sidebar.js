import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { Search, Chat, CurrentUser } from "./index.js";
import { patchMessageReadStatus } from "../../store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  root: {
    paddingLeft: 21,
    paddingRight: 21,
    flexGrow: 1
  },
  title: {
    fontSize: 20,
    letterSpacing: -0.29,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 15
  }
}));

const Sidebar = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { handleChange, searchTerm } = props;
  const conversations = useSelector(state => state.conversations) || [];

  const updateReadStatus = async (messages, convoId, userId, updateConvo) => {
    await dispatch(patchMessageReadStatus(messages, convoId, userId, updateConvo))
  }

  return (
    <Box className={classes.root}>
      <CurrentUser />
      <Typography className={classes.title}>Chats</Typography>
      <Search handleChange={handleChange} />
      {conversations
        .filter((conversation) => conversation.otherUser.username.includes(searchTerm))
        .map((conversation) => {
          return <Chat conversation={conversation} key={conversation.otherUser.username} updateReadStatus={updateReadStatus} />;
        })}
    </Box>
  );
};

export default Sidebar;
