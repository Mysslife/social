import "./rightbar.css";
import OnlineFriend from "../onlineFriend/OnlineFriend";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  getAllFriendsOfOneUser,
  followAnUser,
  unfollowAnUser,
} from "../../redux/apiCalls";
import { useEffect, useState } from "react";
import { useLayoutEffect } from "react";
import { addFollowings, removeFollowings } from "../../redux/currentUser";

const Rightbar = ({ user }) => {
  const allUsers = useSelector((state) => state.allUser.usersList); //-> để render toàn bộ list online friends ngoài home trừ user đang login thì không hiển thị
  const currentUser = useSelector((state) => state.currentUser.currentUser);

  const friends = useSelector((state) => state.userFriends.userFriends);
  const dispatch = useDispatch();

  const [isFollowed, setIsFollowed] = useState(
    currentUser.followings.includes(user?._id)
  );

  useLayoutEffect(() => {
    user && getAllFriendsOfOneUser(dispatch, user.username);
  }, [user, dispatch]);

  // // HANDLE FOLLOW:
  useEffect(() => {
    setIsFollowed(currentUser.followings.includes(user?._id));
  }, [currentUser, user?._id]);

  const handleFollow = () => {
    if (isFollowed) {
      unfollowAnUser(dispatch, currentUser._id, user._id);
      dispatch(removeFollowings(user._id));
    } else {
      followAnUser(dispatch, currentUser._id, user._id);
      dispatch(addFollowings(user._id));
    }

    setIsFollowed(!isFollowed);
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img src="/assets/gift.png" className="birthdayImg" alt="" />
          <span className="birthdayText">
            <b> Mysslife </b> and <b> 3 other friends </b> have a birthday
            today!
          </span>
        </div>
        <img
          className="rightbarAd"
          src="https://shinmoney.files.wordpress.com/2017/08/1b9a9e6a.jpeg"
          alt=""
        />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {allUsers
            .filter((user) => user.username !== currentUser.username)
            .map((user, index) => (
              <OnlineFriend key={index} user={user} />
            ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <button onClick={handleFollow} className="rightbarFollowButton">
            {isFollowed ? "Unfollow" : "Follow"}
            {isFollowed ? <RemoveIcon /> : <AddIcon />}
          </button>
        )}
        <h4 className="rightbarTitle">User information:</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user?.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user?.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">{user?.relationship}</span>
          </div>
        </div>

        <h4 className="rightbarTitle">Followings:</h4>
        <div className="rightbarFollowingContainer">
          {friends.map((friend, index) => (
            <Link
              className="link"
              style={{ color: "#333" }}
              key={index}
              to={`/profile/${friend.username}`}
            >
              <div className="rightbarFollowing">
                <img className="rightbarFollowingImg" src={friend.img} alt="" />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
};

export default Rightbar;
