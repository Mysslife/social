import "./share.css";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import LabelIcon from "@mui/icons-material/Label";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { addOnePost } from "../../redux/apiCalls";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";

const Share = ({ username }) => {
  const [file, setFile] = useState(null);
  const user = useSelector((state) => state.currentUser.currentUser);
  const content = useRef();
  const dispatch = useDispatch();

  useEffect(() => {}, [content]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fileName = new Date().getTime() + file.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;

          default:
            return;
        }
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const newPost = {
            content: content.current.value,
            img: downloadURL,
            userId: user._id,
          };
          addOnePost(dispatch, user._id, newPost);
          window.location.reload();
        });
      }
    );
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            src={user.img || "/assets/person/1.jpeg"}
            className="shareImg"
            alt=""
          />
          <textarea
            placeholder="What's in your mind?"
            className="shareInput"
            ref={content}
            style={{ resize: "none" }}
          />
        </div>
        <hr className="hr" />
        {file && (
          <div className="shareImgContainer">
            <img
              src={URL.createObjectURL(file)}
              alt=""
              className="shareImgDisplay"
            />
            <CancelIcon
              onClick={() => setFile(null)}
              className="shareCancelIcon"
            />
          </div>
        )}
        <form className="bottom" onSubmit={handleSubmit}>
          <div className="shareOptionContainer">
            <label htmlFor="file" className="shareOption">
              <PermMediaIcon htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo of Video</span>
              <input
                type="file"
                id="file"
                accept=".png, .jpeg, .jpg"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: "none" }}
              />
            </label>
            <div className="shareOption">
              <LabelIcon htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <LocationOnIcon htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotionsIcon htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button type="submit" className="shareButton">
            Share
          </button>
        </form>
      </div>
    </div>
  );
};

export default Share;
