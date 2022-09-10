import "./closeFriend.css";

const CloseFriend = ({ user }) => {
  return (
    <li className="friendItem">
      <img className="friendImg" src={user.profilePicture} alt="" />
      <span className="friendName">{user.username}</span>
    </li>
  );
};

export default CloseFriend;
