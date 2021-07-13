import React, { Component } from "react";
import { FormControl, FilledInput } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { postMessage } from "../../store/utils/thunkCreators";
import { setReadStatus } from "../../store/conversations";
import axios from "axios";

const styles = {
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
};

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
    };
  }

  handleChange = (event) => {
    this.setState({
      text: event.target.value,
    });
  };

  handleClick = async (event) => {
    const convoId = this.props.conversationId
    let conversation = this.props.conversations.filter(convo => convo.id === convoId)
    let readMessages = conversation[0].messages.map(message => {
      if (message.senderId !== this.props.user.id) {
        message.isRead = true;
      }
      return message;
    })
    const body = {messages: readMessages}
    const { data } = await axios.patch(`/api/conversations/${convoId}`, body)
    await this.props.setReadStatus(data, convoId);
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    // add sender user info if posting to a brand new convo, so that the other user will have access to username, profile pic, etc.
    const reqBody = {
      text: event.target.text.value,
      recipientId: this.props.otherUser.id,
      conversationId: this.props.conversationId,
      sender: this.props.conversationId ? null : this.props.user,
    };
    await this.props.postMessage(reqBody);
    this.setState({
      text: "",
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <form className={classes.root} onSubmit={this.handleSubmit} onClick={this.handleClick}>
        <FormControl fullWidth hiddenLabel>
          <FilledInput
            classes={{ root: classes.input }}
            disableUnderline
            placeholder="Type something..."
            value={this.state.text}
            name="text"
            onChange={this.handleChange}
          />
        </FormControl>
      </form>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversations: state.conversations,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    postMessage: (message) => {
      dispatch(postMessage(message));
    },
    setReadStatus: (messages, conversationId) => {
      dispatch(setReadStatus(messages, conversationId));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Input));
