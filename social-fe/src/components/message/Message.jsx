import "./message.css";
import { format } from "timeago.js";
import { useState } from "react";
import { useEffect } from "react";
import { userRequest } from "../../redux/requestMethods";

const Message = ({ message, own }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await userRequest.get(`/users/${message.sender}`);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
  }, [message]);

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          alt=""
          src={
            user?.img ||
            "https://www.tokyoweekender.com/wp-content/uploads/2019/11/Nana-Komatsu.jpg"
          }
          className="messageImg"
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
};

export default Message;
