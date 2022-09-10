import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatFriendOnline from "../../components/chatFriendOnline/ChatFriendOnline";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const Messenger = () => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { currentUser } = useSelector((state) => state.currentUser);
  const scrollRef = useRef();

  // SOCKET: ============================
  // const [socket, setSocket] = useState(null);
  // useEffect(() => {
  // setSocket(io("ws://localhost:8900"));
  // }, []);

  // Hoặc lấy socket bằng cách useRef thì nhanh hơn bội phần nhưng sẽ luôn bị connect lại socket server mỗi khi F5, không hay lắm, nên dùng useEffect:
  const socket = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.current = io("ws://localhost:8900");

    // GET MESSAGE:
    socket.current.on("getMessage", (data) => {
      // format các key của arrivalMessage thế này để push vào trong messages:
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createAt: Date.now(),
      });
    });
  }, []);

  // setMessages mỗi khi arrival message có message mới:
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  // useEffect này là để mỗi khi có 1 user login vào server socket thì phải emit lên socket server event add event để socket server lưu giữ ID của user mới login này. Phía socket server không thể lưu trực tiếp được user ID mỗi khi user login nên bắt buộc phải emit event này từ phía client để socket server lấy được user ID để lưu giữ và xử lý!
  useEffect(() => {
    socket.current?.emit("addUser", currentUser._id);
    // Ở phía client, thì sau khi login và emit event addUser thì phía socket server đã nhận dữ liệu mới là user mới login và add vào mảng users và sau đó lại trả về client toàn bộ users đã login để phía client có thể xử lý login, filter, lọc với mảng users đã login.
    socket.current.on("getUsers", (users) => {
      // setOnlineUsers(users);
      setOnlineUsers(
        currentUser.followings.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [currentUser, socket]);

  // =========================

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`
          http://localhost:8800/api/conversations/${currentUser._id}
        `);

        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getConversations();
  }, [currentUser._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`
          http://localhost:8800/api/messages/${currentChat?._id}
        `);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getMessages();
  }, [currentChat]);

  // HANDLE SEND MESSAGE:
  const handleSubmit = async (e) => {
    e.preventDefault();

    const message = {
      sender: currentUser._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    // SOCKET:
    // Thực tế thì khi gửi lên socket server thì phải gửi kèm thêm cả conversationId để khi receiver nhận được dữ liệu từ socket sv trả về có conversationId để check điều kiện nếu currentChat._id === conversation._id thì mới hiển thị tin nhắn mới. Nhưng thôi trong trường hợp này thì chỉ cần như này là đủ. Còn thực tế nếu chỉ có mỗi senderId nhưng không có conversationId thì khi senderId gửi tin nhắn thì ngoài tin nhắn riêng thì mọi group khác có chứa senderId và receiverId thì receiver sẽ nhận được cùng nội dung các tin nhắn từ sender nhưng trong mọi group và như thế là sai. Nên mới bảo thực tế cần có conversationId để check nếu conversationId === currentChat._id thì mới hiển thị tin nhắn mới cho đúng một cuộc trò chuyện dù là private hay group. Nói chung đã tự nghiệm ra.
    // Đoạn text trên đối chiếu với dòng 47.
    const receiverId = currentChat.members.find(
      (memberId) => currentUser._id !== memberId
    );

    socket.current.emit("sendMessage", {
      senderId: currentUser._id,
      receiverId,
      text: newMessage,
    });
    // ======================

    try {
      const res = await axios.post(
        "http://localhost:8800/api/messages",
        message
      );
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  // AUTO SCROLL LAST:
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              type="text"
              placeholder="Search for friends"
              className="chatMenuInput"
            />
            {conversations &&
              conversations.map((conversation) => (
                <div
                  key={conversation._id}
                  onClick={() => setCurrentChat(conversation)}
                >
                  <Conversation
                    conversation={conversation}
                    currentUser={currentUser}
                  />
                </div>
              ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages &&
                    messages.map((message) => (
                      <div ref={scrollRef} key={message._id}>
                        <Message
                          own={currentUser._id === message.sender}
                          message={message}
                        />
                      </div>
                    ))}
                </div>

                <div className="chatBoxBottom">
                  <textarea
                    placeholder="write something"
                    className="chatMessageInput"
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button onClick={handleSubmit} className="chatSubmitButton">
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat!
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatFriendOnline
              onlineUsers={onlineUsers}
              currentUser={currentUser}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;
