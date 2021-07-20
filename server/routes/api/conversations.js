const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
// TODO: for scalability, implement lazy loading
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "DESC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.hasOwnProperty(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set count of unread messages for each user
      convoJSON.userUnreadMessages = convoJSON.messages.filter(message => !message.isRead && message.senderId !== userId).length;
      convoJSON.otherUserUnreadMessages = convoJSON.messages.filter(message => !message.isRead && message.senderId === userId).length;

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[0].text; //convoJSON.messages.length - 1

      // reverse messages order
      convoJSON.messages = convoJSON.messages.reverse();

      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

router.patch('/read/:id', async (req, res, next) => {
  try {
    let convo = await Conversation.findByPk(req.params.id)
    if (!req.user) {
      return res.sendStatus(401);
    } else if (req.user.id !== convo.user1Id && req.user.id !== convo.user2Id) {
      return res.sendStatus(401);
    }

    await Message.update({ isRead: true }, {
      where: {
        conversationId: req.params.id,
        senderId: req.body.conversation.otherUser.id
      }
    })

    const updatedMessages = Message.findAll({
      where: {
        conversationId: req.params.id,
        senderId: req.body.conversation.otherUser.id
      }
    })

    // update user's read message count
    const needToUpdateConvo = req.body.conversation
    needToUpdateConvo.userUnreadMessages = needToUpdateConvo.messages.filter(message => !message.isRead && message.senderId !== req.user.id).length;
    needToUpdateConvo.otherUserUnreadMessages = needToUpdateConvo.messages.filter(message => !message.isRead && message.senderId === req.user.id).length;

    response = {updatedMessages: updatedMessages, updatedConversation: needToUpdateConvo}
    res.status(200).json(response);

  } catch (error) {
    next(error);
  }
})

module.exports = router;