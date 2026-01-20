import { io } from "socket.io-client";

let socket = null;

const listeners = {
  balance: new Set(),
  order: new Set()
};

export const connectSocket = (token, onBalanceUpdate, onOrderUpdate) => {
  const URL = process.env.NEXT_PUBLIC_API_URL;

  if (onBalanceUpdate) listeners.balance.add(onBalanceUpdate);
  if (onOrderUpdate) listeners.order.add(onOrderUpdate);

  if (!socket) {
    socket = io(URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("authenticated", (user) => {
      console.log("✅ Xác thực socket thành công:", user);
      localStorage.setItem("balance", user.balance);
      listeners.balance.forEach(cb => cb(user.balance));
    });

    socket.on("balance_update", (newBalance) => {
      console.log("💰 Balance cập nhật:", newBalance);
      localStorage.setItem("balance", newBalance);
      listeners.balance.forEach(cb => cb(newBalance));
    });

    socket.on("order_update", (orderData) => {
      console.log("📦 Order cập nhật:", orderData);
      listeners.order.forEach(cb => cb(orderData));
    });
  } else if (!socket.connected) {
    socket.connect();
  }

  return {
    socket,
    unsubscribe: () => {
      if (onBalanceUpdate) listeners.balance.delete(onBalanceUpdate);
      if (onOrderUpdate) listeners.order.delete(onOrderUpdate);
    }
  };
};

export const getSocket = () => socket;
