import "./sidebar.css";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import WorkIcon from "@mui/icons-material/Work";
import EventIcon from "@mui/icons-material/Event";
import HelpIcon from "@mui/icons-material/Help";
import GroupIcon from "@mui/icons-material/Group";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import ChatIcon from "@mui/icons-material/Chat";
import SchoolIcon from "@mui/icons-material/School";

import { Users } from "../../dummyData";
import CloseFriend from "../closeFriend/CloseFriend";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="list">
          <li className="listItem">
            <RssFeedIcon className="listItemIcon" />
            <span className="listItemText">Feed</span>
          </li>
          <li className="listItem">
            <ChatIcon className="listItemIcon" />
            <span className="listItemText">Chats</span>
          </li>
          <li className="listItem">
            <VideoLibraryIcon className="listItemIcon" />
            <span className="listItemText">Videos</span>
          </li>
          <li className="listItem">
            <GroupIcon className="listItemIcon" />
            <span className="listItemText">Groups</span>
          </li>
          <li className="listItem">
            <RssFeedIcon className="listItemIcon" />
            <span className="listItemText">Feed</span>
          </li>
          <li className="listItem">
            <BookmarksIcon className="listItemIcon" />
            <span className="listItemText">Bookmarks</span>
          </li>
          <li className="listItem">
            <WorkIcon className="listItemIcon" />
            <span className="listItemText">Jobs</span>
          </li>
          <li className="listItem">
            <EventIcon className="listItemIcon" />
            <span className="listItemText">Events</span>
          </li>
          <li className="listItem">
            <HelpIcon className="listItemIcon" />
            <span className="listItemText">Questions</span>
          </li>
          <li className="listItem">
            <SchoolIcon className="listItemIcon" />
            <span className="listItemText">Courses</span>
          </li>
        </ul>
        <button className="button">Show More</button>
        <hr className="hr" />
        <ul className="friendList">
          {Users.map((user, index) => (
            <CloseFriend key={index} user={user} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
