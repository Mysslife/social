import "./topbar.css";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/currentUser";

const Topbar = () => {
  const user = useSelector((state) => state.currentUser.currentUser);
  const navigate = useNavigate();
  const handleTransfer = () => {
    navigate(`/profile/${user.username}`);
  };

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link className="link" to={"/"}>
          <span className="logo">Mysslife</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchBar">
          <SearchIcon className="searchIcon" />
          <input placeholder="Search for friends" className="searchInput" />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinkContainer">
          <div className="topbarLink">Homepage</div>
          <div className="topbarLink">Timeline</div>
          <div onClick={handleLogout} className="topbarLink">
            Logout
          </div>
        </div>
        <div className="topbarIconContainer">
          <div className="topbarIcon">
            <PersonIcon />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIcon">
            <ChatIcon />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIcon">
            <CircleNotificationsIcon />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <img
          src={
            user.img ||
            "https://afamilycdn.com/150157425591193600/2020/3/20/nana19-1474192068230-15846728489531308483799.jpg"
          }
          alt="profilePics"
          className="topbarImg"
          onClick={handleTransfer}
        />
      </div>
    </div>
  );
};

export default Topbar;
