const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    /* 
      Find the conversation
      If Conversation exists, then check if the sender of the message is one of the two users of the conversation. If not,
      return a 401 status code. 
      If Conversation doesn't exist, then create a new conversation to attach the message too.
    */
    const convo = await Conversation.findByPk(conversationId)

    if (convo?.user1Id === senderId || convo?.user2Id === senderId) {
      // if we already know conversation id, we can save time and just add it to message and return
      if (conversationId) {
        const message = await Message.create({ senderId, text, conversationId });
        return res.json({ message, sender });
      }
    } else if (!convo) {
      // if we don't have conversation id, find a conversation to make sure it doesn't already exist
      let conversation = await Conversation.findConversation(
        senderId,
        recipientId
      );

      if (!conversation) {
        // create conversation
        conversation = await Conversation.create({
          user1Id: senderId,
          user2Id: recipientId,
        });
        if (onlineUsers.includes(sender.id)) {
          sender.online = true;
        }
      }
      const message = await Message.create({
        senderId,
        text,
        conversationId: conversation.id,
      });
      res.json({ message, sender });
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
