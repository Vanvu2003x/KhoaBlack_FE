import { io } from "socket.io-client";

let socket = null;

const listeners = {
  balance: new Set(),
  order: new Set()
};

/**
 * Get Socket.IO server URL
 * Priority:
 * 1. NEXT_PUBLIC_SOCKET_URL (nếu set riêng cho socket)
 * 2. NEXT_PUBLIC_API_URL (fallback to API URL)
 * 3. Same origin (window.location.origin) - cho production trên cùng domain
 */
const getSocketUrl = () => {
  // Priority 1: Dedicated socket URL
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }

  // Priority 2: API URL
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Priority 3: Same origin fallback (useful when FE/BE on same domain)
  if (typeof window !== 'undefined') {
    // In production, if API is on same domain, use origin
    // Otherwise, default to localhost:5000 for development
    const origin = window.location.origin;
    console.warn("⚠️ Socket: No URL configured, using origin:", origin);
    return origin;
  }

  // Fallback for SSR or when no env vars are present
  return undefined;
};

export const connectSocket = (token, onBalanceUpdate, onOrderUpdate) => {
  const URL = getSocketUrl();
  if (process.env.NODE_ENV !== 'production') {
    console.log("🔌 Socket: Target URL =", URL);
    console.log("🔌 Socket: Current origin =", typeof window !== 'undefined' ? window.location.origin : 'SSR');
  }

  if (onBalanceUpdate) listeners.balance.add(onBalanceUpdate);
  if (onOrderUpdate) listeners.order.add(onOrderUpdate);

  if (!socket) {
    if (process.env.NODE_ENV !== 'production') {
      console.log("🔌 Socket: Creating new connection to", URL);
    }
    socket = io(URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 20000, // Connection timeout
      autoConnect: true
    });

    socket.on("connect", () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log("✅ Socket connected successfully!");
        console.log("   Socket ID:", socket.id);
        console.log("   Transport:", socket.io.engine.transport.name);
      }
      // Authenticate with token if provided
      if (token) {
        console.log("🔐 Authenticating socket with token...");
        socket.emit("auth", token);
      }
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      console.error("   Target URL:", URL);

      // Detect specific error types for better debugging
      if (error.message.includes('CORS') || error.message.includes('cors')) {
        console.error("   ⚠️ CORS issue detected! Check backend SOCKET_ORIGINS config");
      }
      if (error.message.includes('websocket') || error.type === 'TransportError') {
        console.error("   ⚠️ WebSocket transport failed. Check Nginx WebSocket proxy config");
        console.error("   Falling back to polling transport...");
      }
      if (error.message.includes('timeout')) {
        console.error("   ⚠️ Connection timeout. Backend may not be responding");
      }
    });

    socket.on("disconnect", (reason) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log("🔌 Socket disconnected:", reason);
      }
      if (reason === "io server disconnect") {
        // Server disconnected, try to reconnect
        socket.connect();
      }
    });

    socket.on("reconnect", (attemptNumber) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log("🔌 Socket reconnected after", attemptNumber, "attempts");
      }
    });

    socket.on("reconnect_error", (error) => {
      console.error("❌ Socket reconnection error:", error.message);
    });

    socket.on("authenticated", (user) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log("✅ Xác thực socket thành công:", user);
      }
      localStorage.setItem("balance", user.balance);
      listeners.balance.forEach(cb => cb(user.balance));
    });

    socket.on("balance_update", (newBalance) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log("💰 Balance cập nhật:", newBalance);
      }
      localStorage.setItem("balance", newBalance);
      listeners.balance.forEach(cb => cb(newBalance));
    });

    socket.on("order_update", (orderData) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log("📦 Order cập nhật:", orderData);
      }
      listeners.order.forEach(cb => cb(orderData));
    });

    socket.on("order_status_update", (data) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log("📦 Order status update:", data);
      }
      listeners.order.forEach(cb => cb(data));
    });
  } else if (!socket.connected) {
    if (process.env.NODE_ENV !== 'production') {
      console.log("🔌 Socket: Reconnecting to", URL);
    }
    socket.connect();
  } else {
    if (process.env.NODE_ENV !== 'production') {
      console.log("🔌 Socket: Already connected, socket.id =", socket.id);
    }
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

// Helper function to check connection status
export const isSocketConnected = () => socket?.connected ?? false;

// Helper function to manually disconnect
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    if (process.env.NODE_ENV !== 'production') {
      console.log("🔌 Socket manually disconnected");
    }
  }
};
