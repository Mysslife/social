import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { userRequest } from "../../redux/requestMethods";
import { useEffect } from "react";

const Profile = () => {
  const location = useLocation();
  const username = location.pathname.split("/")[2];
  const user = useSelector((state) =>
    state.allUser.usersList.find((user) => user.username === username)
  );

  // const user = JSON.parse(localStorage.getItem("socialUser")) || null;

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img src={user?.cover} className="profileCoverImg" alt="" />
              <img src={user?.img} className="profileUserImg" alt="" />
            </div>
            <div className="profileInfo">
              <h4 className="profileUsername">{user?.username}</h4>
              <h4 className="profileUserDesc">{user?.desc}</h4>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} profile />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
