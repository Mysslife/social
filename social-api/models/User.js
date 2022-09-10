const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: { type: String, require: true, unique: true, min: 3, max: 20 },
    email: { type: String, require: true, max: 50, unique: true },
    password: { type: String, require: true, min: 6 },
    img: { type: String, default: "" },
    cover: { type: String, default: "" },
    followers: { type: Array, default: [] },
    followings: { type: Array, default: [] },
    isAdmin: { type: Boolean, default: false },
    desc: { type: String },
    city: { type: String },
    from: { type: String },
    relationShip: { type: String },
    posts: { type: Array },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
