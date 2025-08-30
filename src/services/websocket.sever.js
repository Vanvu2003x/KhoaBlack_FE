import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (token, onBalanceUpdate) => {
  if (!token) {
    console.error("❌ Không có token khi kết nối socket.");
    return;
  }

  socket = io("http://localhost:5000");

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
    socket.emit("auth", token);
  });

  socket.on("authenticated", (user) => {
    console.log("✅ Xác thực socket thành công:", user);
    localStorage.setItem("balance", user.balance);
    if (onBalanceUpdate) {
      onBalanceUpdate(user.balance); 
    }
  });

  socket.on("balance_update", (newBalance) => {
    console.log("💰 Balance cập nhật:", newBalance);
    localStorage.setItem("balance", newBalance);
    localStorage.removeItem("tttt")
    if (onBalanceUpdate) {
      onBalanceUpdate(newBalance); 
    }
  });

  socket.on("error", (err) => {
    console.error("❌ Socket error:", err);
  });

  socket.on("disconnect", () => {
    console.log("🔌 Socket disconnected");
  });

  return socket;
};

export const getSocket = () => socket;
