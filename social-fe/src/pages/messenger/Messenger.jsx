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
   const socket = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.current = io("ws://localhost:8900");

    // GET MESSAGE:
    socket.current.on("getMessage", (data) => {
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

   useEffect(() => {
    socket.current?.emit("addUser", currentUser._id);
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
