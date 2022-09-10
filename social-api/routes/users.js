const User = require("../models/User");
const router = require("express").Router();
const {
  verifyUserToken,
  verifyAdminToken,
  verifyToken,
} = require("./verifyToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// UPDATE USER:
router.put("/:id", verifyUserToken, async (req, res) => {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    const { password, ...info } = updatedUser._doc;
    const accessToken = jwt.sign(
      { id: updatedUser._id, isAdmin: updatedUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    return res.status(200).json({ ...info, accessToken });
  } catch (err) {
    return res.status(500).json(err);
  }
});

// DELETE USER:
router.delete("/:id", verifyUserToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json("This account has been deleted!");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET A USER:
router.get("/:id", verifyUserToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(403).json("User not found!");

    const { password, ...info } = user._doc;
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    return res.status(200).json({ ...info, accessToken });
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET ALL USER:
router.get("/", verifyAdminToken, async (req, res) => {
  const newQueryValue = req.query.new;
  try {
    const users = newQueryValue
      ? await User.find().sort({ createAt: -1 })
      : await User.find();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET ALL FRIENDS hay còn được hiểu là FOLLOWINGS:
router.get("/friends/:username", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );

    let friendList = [];
    friends.map((friend) => {
      const { _id, username, img } = friend;
      friendList.push({ _id, username, img });
    });

    return res.status(200).json(friendList);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// FOLLOW AN USER:
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("You already followed this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
});

// UNFOLLOW AN USER:
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("User has been unfollowed");
      } else {
        res.status(403).json("You don't follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't unfollow yourself");
  }
});

module.exports = router;
