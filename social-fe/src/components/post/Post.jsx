import "./post.css";
import { useState, useEffect } from "react";
import { getAllUser } from "../../redux/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { userRequest } from "../../redux/requestMethods";
import { format } from "timeago.js";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { updatePost } from "../../redux/apiCalls";

const Post = ({ post }) => {
  const currentUser = useSelector((state) => state.currentUser.currentUser);
  const [likeQtt, setLikeQtt] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const users = useSelector((state) => state.allUser.usersList);
  const user = users.find((user) => user._id === post.userId);
  const dispatch = useDispatch();

  // UPDATE MODE:
  const [updateMode, setUpdateMode] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    setContent(post.content);
  }, [post.content]);

  const handleUpdate = () => {
    const updateInfo = {
      postId: post._id,
      userId: currentUser._id,
      content,
    };

    updatePost(dispatch, updateInfo);
    window.location.reload();
  };

  // ----------------------------------

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [post.likes, currentUser._id]);

  useEffect(() => {
    getAllUser(dispatch);
  }, [dispatch]);

  // HANDLE CLICK LIKE:
  const handleClick = async (postId) => {
    try {
      await userRequest.put(`/posts/${postId}/like`, {
        userId: currentUser?._id,
      });
    } catch (err) {
      console.log(err);
    }

    setLikeQtt(isLiked ? likeQtt - 1 : likeQtt + 1);
    setIsLiked(isLiked ? false : true);
  };

  return (
    <div className="post">
      <div className="wrapper">
        <div className="postTop">
          <div className="topLeft">
            <Link
              className="postUserImg link"
              to={`/profile/${user?.username}`}
            >
              <img src={user?.img} className="postUserImg" alt="" />
            </Link>
            <div className="postTimeContainer">
              <span className="postUsername">{user?.username}</span>
              <span className="postDate">
                {format(new Date(post.createdAt))}
              </span>
            </div>
          </div>

          {currentUser._id === post.userId && (
            <div className="topRight">
              <EditIcon
                onClick={() => setUpdateMode(true)}
                className="topRightIcon edit"
              />
              <DeleteIcon className="topRightIcon delete" />
            </div>
          )}
        </div>
        <div className="postCenter">
          {updateMode ? (
            <input
              type="text"
              autoFocus
              onChange={(e) => setContent(e.target.value)}
              className="postTextInput"
              value={content}
            />
          ) : (
            <span className="postText">{post.content}</span>
          )}
          <img className="postImg" src={post.img} alt="" />
          {updateMode && (
            <div className="postUpdateButtonContainer">
              <button onClick={handleUpdate} className="postUpdateButton">
                Update
              </button>
            </div>
          )}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              onClick={() => handleClick(post._id)}
              className="postIcon"
              src="/assets/like.png"
              alt=""
            />
            <img
              onClick={() => handleClick(post._id)}
              className="postIcon"
              src="/assets/heart.png"
              alt=""
            />
            <span className="postCounter">
              {likeQtt}
              {isLiked ? (
                <span className="liked">
                  You and others people liked this post
                </span>
              ) : (
                <span className="unlike">people liked this post</span>
              )}
            </span>
          </div>
          <div className="postBottomRight">
            <span className="postComment">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
