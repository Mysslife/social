import { Link } from "react-router-dom";
import "./onlineFriend.css";

const OnlineFriend = ({ user }) => {
  return (
    <Link
      className="link"
      style={{ color: "#333" }}
      to={`/profile/${user.username}`}
    >
      <li className="rightbarFriend">
        <div className="rightbarProfileImgContainer">
          <img className="rightbarProfileImg" src={user.img} alt="" />
          <span className="rightbarOnline"></span>
        </div>
        <span className="rightbarUsername">{user.username}</span>
      </li>
    </Link>
  );
};

export default OnlineFriend;
