import { useEffect, useState } from "react";
import "./conversation.css";
import { userRequest } from "../../redux/requestMethods";

const Conversation = ({ conversation, currentUser }) => {
  const [friend, setFriend] = useState(null);

  useEffect(() => {
    const friendId = conversation.members.find(
      (member) => member !== currentUser._id
    );

    const getUser = async () => {
      try {
        const res = await userRequest.get(`/users/${friendId}`);
        setFriend(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
  }, [conversation, currentUser]);

  return (
    <div className="conversation">
      <img
        src={
          friend
            ? friend.img
            : "https://www.tokyoweekender.com/wp-content/uploads/2019/11/Nana-Komatsu.jpg"
        }
        alt=""
        className="conversationImg"
      />
      <span className="conversationName">{friend?.username}</span>
    </div>
  );
};

export default Conversation;
