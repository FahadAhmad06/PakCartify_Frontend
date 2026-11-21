import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { socket } from "../socket";

function ChatNotificationIcon() {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const loadUnreadCount = () => {
    api.get("/chat/admin/conversations")
      .then(res => {
        const total = res.data.reduce((sum, c) => sum + (c.unreadByAdmin || 0), 0);
        setUnreadCount(total);
      })
      .catch(err => console.error("Failed to load unread count:", err));
  };

  useEffect(() => {
    loadUnreadCount();
    socket.on("receiveMessage", () => loadUnreadCount());
    return () => socket.off("receiveMessage");
  }, []);

  return (
    <button
      onClick={() => navigate("/admin/messages")}
      className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
      title="Customer Messages"
    >
      <span className="text-xl">💬</span>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
}

export default ChatNotificationIcon;