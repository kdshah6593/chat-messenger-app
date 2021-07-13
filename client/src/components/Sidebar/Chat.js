import React, { Component } from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { withStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";
import UnreadBadge from "./UnreadBadge";

const styles = {
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
};


class Chat extends Component {
  handleClick = async (conversation) => {
    let messages = conversation.messages
    let readMessages = messages.map(message => {
      if (message.senderId !== this.props.user.id) {
        message.isRead = true;
      }
      return message;
    })
    let convoId = conversation.id

    const body = {
      messages: readMessages,
    }

    await this.props.updateReadStatus(body, convoId)
    await this.props.setActiveChat(conversation.otherUser.username);
  };

  unreadCount = () => {
    const convo = this.props.conversation
    const unreadMessages = convo.messages.filter(message => message.isRead === false && message.senderId !== this.props.user.id);
    return unreadMessages.length;
  }

  render() {
    const { classes } = this.props;
    const otherUser = this.props.conversation.otherUser;
    return (
      <Box
        onClick={() => this.handleClick(this.props.conversation)}
        className={classes.root}
      >
        <BadgeAvatar
          photoUrl={otherUser.photoUrl}
          username={otherUser.username}
          online={otherUser.online}
          sidebar={true}
        />
        <ChatContent conversation={this.props.conversation} unreadCount={this.unreadCount} />
        <UnreadBadge unreadCount={this.unreadCount} />
      </Box>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Chat));
