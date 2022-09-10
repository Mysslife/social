const Post = require("../models/Post");
const User = require("../models/User");
const router = require("express").Router();
const {
  verifyToken,
  verifyUserToken,
  verifyAdminToken,
} = require("./verifyToken");

// CREATE POST:
router.post("/:id", verifyUserToken, async (req, res) => {
  // :id này là id của user tạo post
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    const user = await User.findById(req.body.userId);
    await user.updateOne({ $push: { posts: savedPost._id } });
    return res.status(200).json(savedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// UPDATE POST:
router.put("/:id", verifyUserToken, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (post) {
      if (req.body.userId === post.userId) {
        try {
          const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
          );
          // Cách trên là nếu muốn update xong trả lại kết quả luôn.

          // Còn bình thường thì update xong là refresh lại page nên cũng không cần trả lại kết quả mà chỉ cần fetch lại dữ liệu sau khi update bằng refresh page = window.location.reload() là được rồi.
          // const updatedPost = await post.updateOne({ $set: req.body });
          return res.status(200).json(updatedPost);
        } catch (err) {
          return res.status(500).json(err);
        }
      } else {
        return res.status(403).json("You cannot edit other people's posts!");
      }
    } else {
      return res.status(404).json("Post not found!");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// DELETE A POST:
router.delete("/:id", verifyUserToken, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (post) {
      if (req.body.userId === post.userId) {
        try {
          await post.deleteOne();
          return res
            .status(200)
            .json("This post has been deleted successfully!");
        } catch (err) {
          return res.status(500).json(err);
        }
      } else {
        return res.status(403).json("You cannot delete other people's posts!");
      }
    } else {
      return res.status(404).json("Post not found!");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// LIKE AND DISLIKE A POST:
router.put("/:id/like", verifyUserToken, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (post) {
      try {
        if (post.likes.includes(req.body.userId)) {
          await post.updateOne({ $pull: { likes: req.body.userId } });
          return res.status(401).json("You disliked this post!");
        } else {
          await post.updateOne({ $push: { likes: req.body.userId } });
          return res.status(200).json("You liked this post!");
        }
      } catch (err) {
        return res.status(403).json("You are not authenticated!");
      }
    } else {
      return res.status(404).json("Post not found!");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET A POST:
router.get("/:id", verifyUserToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found!");

    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET TIMELINE POST: tìm tất cả bài posts của user đang login và của những người mà user này đang follows để hiển thị ra ngoài newfeeds
router.get("/timeline/:id", verifyUserToken, async (req, res) => {
  // :id này cũng là id của user đang login
  try {
    // const currentUser = await User.findById(req.params.id);
    // const userPosts = await Post.find({ userId: req.params.id });

    const [currentUser, userPosts] = await Promise.all([
      await User.findById(req.params.id),
      await Post.find({ userId: req.params.id }),
    ]);

    const friendPosts = await Promise.all(
      //-> ở đây dùng Promise.all vì để xử lý await. Vì await không dùng được trong phần return của hàm map.
      //-> và nếu muốn loop qua một mảng nào đấy (VD như mảng followings) để lấy dữ liệu fetching từ DB thì bắt buộc phải dùng "await Promise.all" để xử lý được hàm map!
      // https://www.youtube.com/watch?v=ldGl6L4Vktk (1:24:45)
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );

    return res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET ALL POSTS OF A USER:
router.get("/profile/:username", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });

    res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
