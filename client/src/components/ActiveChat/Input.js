import React, { useState } from "react";
import { FormControl, FilledInput } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { postMessage, patchMessageReadStatus } from "../../store/utils/thunkCreators";

const useStyles = makeStyles({
  root: {
    justifySelf: "flex-end",
    marginTop: 15,
  },
  input: {
    height: 70,
    backgroundColor: "#F4F6FA",
    borderRadius: 8,
    marginBottom: 20,
  },
});

const Input = (props) => {
  const [text, setText] = useState("")
  const user = useSelector(state => state.user)
  const conversations = useSelector(state => state.conversations)
  const dispatch = useDispatch();
  const classes = useStyles();

  const handleChange = (event) => {
    setText(event.target.value)
  };

  const handleClick = async (event) => {
    const messages = props.messages
    const convoId = props.conversationId
    const userId = user.id
    const updateConvo = props.conversation
    await dispatch(patchMessageReadStatus(messages, convoId, userId, updateConvo));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    // add sender user info if posting to a brand new convo, so that the other user will have access to username, profile pic, etc.
    const reqBody = {
      text: event.target.text.value,
      recipientId: props.otherUser.id,
      conversationId: props.conversationId,
      sender: props.conversationId ? null : props.user,
    };
    await dispatch(postMessage(reqBody));
    setText("");
  };

  
  return (
    <form className={classes.root} onSubmit={handleSubmit} onClick={handleClick}>
      <FormControl fullWidth hiddenLabel>
        <FilledInput
          classes={{ root: classes.input }}
          disableUnderline
          placeholder="Type something..."
          value={text}
          name="text"
          onChange={handleChange}
        />
      </FormControl>
    </form>
  );
}

export default Input;
