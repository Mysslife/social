const router = require("express").Router();
const Conversation = require("../models/Conversation");

// new conversation:
router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    return res.status(200).json(savedConversation);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// get conversation of a user:
router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const conversation = await Conversation.find({
      members: { $in: [userId] },
    });
    return res.status(200).json(conversation);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// get conversation of two user:
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });

    return res.status(200).json(conversation);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
