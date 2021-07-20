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

    // if conversation exists and user is part of it, message will send
    const currentConversation = await Conversation.findByPk(conversationId)

    if (currentConversation?.user1Id === senderId || currentConversation?.user2Id === senderId) {
      // if conversation id known, add it to message and return
      if (conversationId) {
        const message = await Message.create({ senderId, text, conversationId });
        return res.json({ message, sender });
      }
    } else if (!currentConversation) {
      // if conversation id unknown, find a conversation to make sure it doesn't already exist
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
        if (onlineUsers.hasOwnProperty(sender.id)) {
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
      return res.sendStatus(403);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
