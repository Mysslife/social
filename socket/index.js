const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// Vì socket.id ở phía client khi login vào dù cùng một tài khoản nhưng luôn thay đổi nên phải tạo một mảng user ở phía socket server:
/* Ví dụ: users = [
              {userId: "1123123", "socketId": "12312312gvb3"},
              {userId: "5465464", "socketId": "123123123asd"},
              {userId: "8984233", "socketId": "4446asdsasda"},
              {userId: "5460468", "socketId": "444664fwsert"},
          ]
*/
let users = [];

// Vì nếu dùng users.push(userId) mới mỗi khi có user login thì sẽ bị trùng trong trường hợp nếu một user logout và login lại thì thành 2 id của 1 user nên phải lọc trùng userId mỗi khi add vào mảng users:
// => Check trùng thì dùng hàm some!!!!
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

// Function Remove User mỗi khi có user logout!
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

// GET USER:
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // socket này đặc biệt quan trọng cần phải hiểu! Mỗi khi user login vào socket server thì socket này sẽ là một luồng duy nhất liên kết giữa client và socket server, cho đến khi user logout từ phía client thì socket này mới mất đi. Và khi login lại thì sẽ lại tạo ra một socket mới để liên kết, kết nối giữa client và socket server! OK RẤT HAY VÀ ĐÃ HIỂU!!!!
  // console.log("user connected!");

  // When connect:
  // take userId and socketId from users when they logged in:
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);

    // sau khi add xong mỗi user mới login vào mảng users ở socket server thì send users này đến toàn bộ client user đã login để ở phía client có thể lọc dữ liệu.
    io.emit("getUsers", users);
  });

  // SEND AND GET MESSAGE:
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const receiver = getUser(receiverId);
    io.to(receiver.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  // When disconnect:
  // Hai event connection và disconnect là 2 sự kiện mặc định của socket server nên phía client không cần emit 2 hành động này thì khi client logout thì socket server vẫn lắng nghe được sự kiện logout của client để thực hiện hành động! HAY!
  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
