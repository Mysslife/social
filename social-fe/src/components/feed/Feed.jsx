import "./feed.css";
import Share from "../share/Share";
import Post from "../post/Post";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllPostsOfOneUser } from "../../redux/apiCalls";

const Feed = ({ username, profile, home }) => {
  const user = useSelector((state) => state.currentUser.currentUser);
  const posts = useSelector((state) => state.userPosts.userPosts);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      getAllPostsOfOneUser(dispatch, username, user._id);
    }
  }, [user, dispatch, username, user._id]);

  return (
    <div className="feed">
      <div className="wrapper">
        {(profile && username === user.username) || home ? (
          <Share username={username} />
        ) : (
          ""
        )}

        {posts && posts.map((post, index) => <Post key={index} post={post} />)}
      </div>
    </div>
  );
};

export default Feed;
