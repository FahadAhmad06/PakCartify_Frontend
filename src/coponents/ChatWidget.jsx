import { useEffect, useState, useRef } from "react";
import { socket } from "../socket";
import api from "../api";
import { toast } from "react-toastify";
import {
  FiPaperclip, FiSend, FiX, FiTrash2, FiCheckCircle, FiMessageCircle
} from "react-icons/fi";

const GREETING_TEXT = "Assalam-O-Alaikum! How can We help you?";

function ChatWidget({ user }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showGreeting, setShowGreeting] = useState(false);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user || user.role === "admin") return;
    socket.emit("register", { userId: user._id, role: "user" });

    api.get("/chat/conversation")
      .then(res => {
        setConversationId(res.data._id);
        return api.get(`/chat/messages/${res.data._id}`);
      })
      .then(res => setMessages(res.data));

    socket.on("receiveMessage", (msg) => {
      setMessages(prev => [...prev, msg]);
      if (!open && msg.senderRole === "admin") {
        toast.info(`💬 Support: ${msg.message || "Sent a photo"}`, { position: "top-right", autoClose: 4000 });
      }
    });

    socket.on("messagesSeen", ({ conversationId: seenConvoId }) => {
      setMessages(prev => {
        if (conversationId && seenConvoId === conversationId) {
          return prev.map(m => m.senderRole === "user" ? { ...m, isRead: true } : m);
        }
        return prev;
      });
    });

    socket.on("messageDeleted", ({ messageId }) => {
      setMessages(prev => prev.filter(m => m._id !== messageId));
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("messagesSeen");
      socket.off("messageDeleted");
    };
  }, [user, conversationId, open]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, open, showGreeting]);

  useEffect(() => {
    if (open && conversationId) {
      api.put(`/chat/read/${conversationId}`).catch(() => {});
      socket.emit("markAsRead", { conversationId, readerRole: "user", receiverId: "admin" });
    }
  }, [open, conversationId]);

  const handleOpen = () => {
    setOpen(true);

    const today = new Date().toDateString();
    const lastShown = localStorage.getItem("chatGreetingLastShown");

    if (lastShown !== today) {
      setShowGreeting(true);
      localStorage.setItem("chatGreetingLastShown", today);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const sendMessage = async () => {
    if ((!text.trim() && !image) || !conversationId) return;

    const formData = new FormData();
    formData.append("conversationId", conversationId);
    formData.append("message", text);
    formData.append("senderRole", "user");
    if (image) formData.append("image", image);

    try {
      const res = await api.post("/chat/messages", formData);
      socket.emit("sendMessage", {
        conversationId,
        senderId: user._id,
        senderRole: "user",
        message: res.data.message,
        image: res.data.image,
        receiverId: "admin",
      });
      setText("");
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Failed to send:", err);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await api.delete(`/chat/messages/${messageId}`);
      setMessages(prev => prev.filter(m => m._id !== messageId));
      socket.emit("deleteMessage", { messageId, conversationId, receiverId: "admin" });
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (!user || user.role === "admin") return null;

  return (
    <div className="fixed bottom-5 right-5 z-[1000]">
      {/* Floating trigger button */}
      {!open && (
        <div
          onClick={handleOpen}
          className="relative flex items-center bg-gradient-to-br from-[#0E5D33] to-[#127a43] rounded-full p-2.5 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden hover:pr-6"
        >
          <div className="relative w-11 h-11 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <span className="absolute -inset-1 rounded-full border-2 border-[#7ED384] opacity-70 animate-ping" />
            <FiMessageCircle size={20} className="text-[#0E5D33]" />
          </div>
          <span className="max-w-0 opacity-0 whitespace-nowrap overflow-hidden text-white text-sm font-semibold transition-all duration-300 group-hover:max-w-[140px] group-hover:opacity-100 group-hover:ml-2.5">
            Chat with us
          </span>
        </div>
      )}

      {/* Chat window */}
      {open && (
        <div className="w-[340px] h-[480px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-[slideUp_0.25s_ease-out]">
          {/* Header */}
          <div className="relative flex items-center justify-between bg-gradient-to-br from-[#0E5D33] to-[#127a43] text-white px-5 py-4 overflow-hidden">
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -bottom-10 -left-4 w-20 h-20 bg-white/10 rounded-full" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
                <FiMessageCircle size={18} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm leading-tight">PakCartify Support</p>
                <p className="text-[11px] text-green-100 leading-tight flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full inline-block" />
                  We typically reply shortly
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-full w-7 h-7 flex items-center justify-center transition-colors relative z-10 cursor-pointer"
            >
              <FiX size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3.5 py-4 bg-gray-50 space-y-3">
            {showGreeting && (
              <div className="flex justify-start">
                <div className="flex flex-col items-start max-w-[78%]">
                  <span className="px-3.5 py-2.5 rounded-2xl text-sm shadow-sm bg-white text-gray-800 rounded-bl-md border border-gray-100 leading-relaxed">
                    {GREETING_TEXT}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">
                    {formatTime(new Date())}
                  </span>
                </div>
              </div>
            )}

            {messages.length === 0 && !showGreeting && (
              <div className="flex flex-col items-center justify-center h-full text-center px-6 -mt-4">
                <div className="w-14 h-14 rounded-full bg-[#0E5D33]/10 flex items-center justify-center mb-3 text-[#0E5D33]">
                  <FiMessageCircle size={24} />
                </div>
                <p className="text-gray-500 text-sm">How can we help you today?</p>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.senderRole === "user" ? "justify-end" : "justify-start"} group`}>
                <div className={`flex flex-col ${m.senderRole === "user" ? "items-end" : "items-start"} max-w-[78%]`}>
                  <div className="flex items-center gap-1.5">
                    {m.senderRole === "user" && m._id && (
                      <button
                        onClick={() => deleteMessage(m._id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all cursor-pointer hover:scale-110"
                        title="Delete message"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    )}
                    <div className="flex flex-col items-end">
                      {m.image?.url && (
                        <img src={m.image.url} alt="attachment" className="rounded-2xl mb-1 max-w-full max-h-48 object-cover shadow-md" />
                      )}
                      {m.message && (
                        <span
                          className={`px-3.5 py-2.5 rounded-2xl text-sm shadow-sm leading-relaxed break-words ${
                            m.senderRole === "user"
                              ? "bg-gradient-to-br from-[#0E5D33] to-[#127a43] text-white rounded-br-md"
                              : "bg-white text-gray-800 rounded-bl-md border border-gray-100"
                          }`}
                        >
                          {m.message}
                        </span>
                      )}
                    </div>
                    {m.senderRole !== "user" && m._id && (
                      <button
                        onClick={() => deleteMessage(m._id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all cursor-pointer hover:scale-110"
                        title="Delete message"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1 flex items-center gap-1">
                    {m.createdAt ? formatTime(m.createdAt) : ""}
                    {m.senderRole === "user" && (
                      <span className={`flex items-center ${m.isRead ? "text-blue-500" : "text-gray-400"}`}>
                        <FiCheckCircle size={11} />
                      </span>
                    )}
                  </span>
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          {imagePreview && (
            <div className="px-3.5 pt-2 bg-white border-t border-gray-50">
              <div className="relative inline-block">
                <img src={imagePreview} alt="preview" className="w-16 h-16 object-cover rounded-xl border border-gray-200 shadow-sm" />
                <button
                  onClick={() => { setImage(null); setImagePreview(null); }}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md transition-colors cursor-pointer"
                >
                  <FiX size={12} />
                </button>
              </div>
            </div>
          )}

          {/* Composer */}
          <div className="flex items-center gap-2 border-t border-gray-100 p-2.5 bg-white">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-500 hover:text-[#0E5D33] hover:bg-gray-100 transition-colors w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer"
              title="Attach image"
            >
              <FiPaperclip size={17} />
            </button>
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 text-sm px-4 py-2.5 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-[#0E5D33]/40 focus:bg-white transition-all"
            />
            <button
              onClick={sendMessage}
              className="bg-gradient-to-br from-[#0E5D33] to-[#127a43] hover:shadow-lg active:scale-95 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all flex-shrink-0 shadow-md cursor-pointer"
            >
              <FiSend size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWidget;