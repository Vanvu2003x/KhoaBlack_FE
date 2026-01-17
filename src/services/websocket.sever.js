import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (token, onBalanceUpdate) => {
  // Token is ignored as we use cookies now
  const URL = process.env.NEXT_PUBLIC_API_URL;

  if (!socket) {
    socket = io(URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'], // Prefer websocket over polling
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("error", (err) => {
      console.error("❌ Socket error:", err);
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
    });
  } else {
    if (!socket.connected) {
      socket.connect();
    }
    console.log("♻️ Reusing existing socket connection");
  }

  // Always update listeners to ensure the latest callback is used
  if (onBalanceUpdate) {
    // Clear previous listeners to avoid duplicates (stale closures)
    socket.off("balance_update");
    socket.off("authenticated");

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
  }

  return socket;
};

export const getSocket = () => socket;
