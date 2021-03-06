const setUnreadMessageForUser = (conversation) => {
  const unreadMessages = conversation.messages.filter(message => !message.isRead && message.senderId === conversation.otherUser.id)
  return unreadMessages.length;
}

const setUnreadMessageForOtherUser = (conversation) => {
  const unreadMessages = conversation.messages.filter(message => !message.isRead && message.senderId !== conversation.otherUser.id)
  return unreadMessages.length;
}

export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    newConvo.userUnreadMessages = setUnreadMessageForUser(newConvo)
    newConvo.otherUserUnreadMessages = setUnreadMessageForOtherUser(newConvo)
    return [newConvo, ...state];
  }
  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      convoCopy.userUnreadMessages = setUnreadMessageForUser(convoCopy)
      convoCopy.otherUserUnreadMessages = setUnreadMessageForOtherUser(convoCopy)

      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = { ...convo };
      newConvo.id = message.conversationId;
      newConvo.messages.push(message);
      newConvo.latestMessageText = message.text;
      newConvo.userUnreadMessages = setUnreadMessageForUser(newConvo)
      newConvo.otherUserUnreadMessages = setUnreadMessageForOtherUser(newConvo)
      return newConvo;
    } else {
      return convo;
    }
  });
};

export const setReadMessage = (state, payload) => {
  const updateConvo = payload.data.updatedConversation
  const {conversationId} = payload;

  return state.map((convo) => {
    if (convo.id === conversationId) {
      const convoCopy = { ...convo };
      convoCopy.userUnreadMessages = updateConvo.userUnreadMessages
      convoCopy.otherUserUnreadMessages = updateConvo.otherUserUnreadMessages
      return convoCopy
    } else {
      return convo
    }
  })
}