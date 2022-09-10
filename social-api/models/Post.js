const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    userId: { type: String, require: true },
    content: { type: String, max: 500 },
    img: { type: String },
    likes: { type: Array, default: [] },
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model("Post", PostSchema);
module.exports = PostModel;
