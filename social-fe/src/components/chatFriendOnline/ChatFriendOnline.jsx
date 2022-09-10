import { useEffect, useState } from "react";
import "./chatFriendOnline.css";
import { userRequest } from "../../redux/requestMethods";
import axios from "axios";

const ChatFriendOnline = ({ onlineUsers, currentUser, setCurrentChat }) => {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await userRequest.get(
          "/users/friends/" + currentUser.username
        );

        setFriends(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getFriends();
  }, [currentUser]);

  useEffect(() => {
    setOnlineFriends(
      friends.filter((friend) => onlineUsers.includes(friend._id))
    );
  }, [friends, onlineUsers]);

  const handleClick = async (onlineFriend) => {
    try {
      const res = await axios(`
        http://localhost:8800/api/conversations/find/${currentUser._id}/${onlineFriend._id}
      `);

      setCurrentChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatOnline">
      {onlineFriends.map((onlineFriend, index) => (
        <div
          onClick={() => handleClick(onlineFriend)}
          key={index}
          className="chatOnlineFriend"
        >
          <div className="chatOnlineImgContainer">
            <img
              src={
                onlineFriend.img ||
                "https://www.tokyoweekender.com/wp-content/uploads/2019/11/Nana-Komatsu.jpg"
              }
              alt=""
              className="chatOnlineImg"
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{onlineFriend.username}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatFriendOnline;
