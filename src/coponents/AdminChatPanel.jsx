import { useEffect, useState, useRef } from "react";
import { socket } from "../socket";
import api from "../api";
import { toast } from "react-toastify";
import {
  FiSearch, FiX, FiPaperclip, FiSend, FiChevronLeft, FiInfo,
  FiPackage, FiDollarSign, FiCalendar, FiPhone, FiMail,
  FiCopy, FiSlash, FiShoppingBag, FiMessageCircle, FiTrash2,
  FiCheckCircle, FiUserCheck, FiBellOff, FiBell, FiDownload,
  FiRefreshCcw, FiMoreVertical
} from "react-icons/fi";
import { BsPinAngleFill, BsPinAngle } from "react-icons/bs";

function AdminChatPanel() {
  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const [filterTab, setFilterTab] = useState("all");
  const [pinnedIds, setPinnedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pinnedConvos") || "[]");
    } catch {
      return [];
    }
  });
  const [mutedIds, setMutedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mutedConvos") || "[]");
    } catch {
      return [];
    }
  });
  const [showMenu, setShowMenu] = useState(false);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    socket.emit("register", { userId: "admin", role: "admin" });
    loadConversations();

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => {
        if (selectedConvo && msg.conversationId === selectedConvo._id) {
          return [...prev, msg];
        }
        return prev;
      });
      loadConversations();

      const isMuted = mutedIds.includes(msg.conversationId);
      if (msg.senderRole === "user" && !isMuted && (!selectedConvo || msg.conversationId !== selectedConvo._id)) {
        toast.info("💬 New customer message", { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
      }
    });

    socket.on("messagesSeen", ({ conversationId }) => {
      setMessages((prev) => {
        if (selectedConvo && conversationId === selectedConvo._id) {
          return prev.map((m) => (m.senderRole === "admin" ? { ...m, isRead: true } : m));
        }
        return prev;
      });
    });

    socket.on("messageDeleted", ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("messagesSeen");
      socket.off("messageDeleted");
    };
  }, [selectedConvo, mutedIds]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, selectedConvo]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadConversations = () => {
    api.get("/chat/admin/conversations").then((res) => setConversations(res.data));
  };

  // ---------- Fetch orders for the selected customer (robust version) ----------
  const loadOrdersForUser = async (userLike) => {
    // convo.user can be a populated object ({ _id, name, ... }) or, in some
    // API responses, just a raw ObjectId string. Handle both safely.
    const userId =
      typeof userLike === "object" && userLike !== null ? userLike._id : userLike;

    if (!userId) {
      console.warn("[AdminChatPanel] No valid user id on conversation, cannot load orders:", userLike);
      setOrders([]);
      setOrdersError("Customer id missing on this conversation.");
      return;
    }

    setLoadingOrders(true);
    setOrdersError(null);
    try {
      // NOTE: there is no dedicated backend route to fetch orders for a
      // single user (e.g. /admin/orders/user/:id) yet. Until that exists,
      // we reuse the existing "/admin/orders" (all orders) route and filter
      // client-side by the customer's id. If the order list grows large,
      // add a proper backend route (e.g. GET /admin/orders/user/:userId)
      // that queries Order.find({ user: userId }) and switch this back to
      // calling that endpoint directly.
      const orderRes = await api.get(`/admin/orders`);

      const raw = orderRes?.data;
      const allOrders =
        (Array.isArray(raw?.orders) && raw.orders) ||
        (Array.isArray(raw?.data) && raw.data) ||
        (Array.isArray(raw) && raw) ||
        [];

      if (allOrders.length === 0 && raw && !Array.isArray(raw) && !raw.orders && !raw.data) {
        console.warn("[AdminChatPanel] Unexpected /admin/orders response shape:", raw);
      }

      const list = allOrders.filter((o) => {
        const orderUserId = typeof o.user === "object" && o.user !== null ? o.user._id : o.user;
        return orderUserId === userId;
      });

      setOrders(list);
    } catch (err) {
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.message;
      console.error("[AdminChatPanel] Failed to load orders:", status, serverMsg || err.message);
      setOrders([]);
      setOrdersError(
        status === 404
          ? "Orders route not found (check backend endpoint /admin/orders)."
          : serverMsg || "Failed to load orders for this customer."
      );
    } finally {
      setLoadingOrders(false);
    }
  };

  const openConversation = async (convo) => {
    setSelectedConvo(convo);
    setOrders([]);
    setOrdersError(null);
    setShowInfoPanel(false);
    setShowMenu(false);

    const res = await api.get(`/chat/messages/${convo._id}`);
    setMessages(res.data);

    await api.put(`/chat/read/${convo._id}`);
    setConversations((prev) => prev.map((c) => (c._id === convo._id ? { ...c, unreadByAdmin: 0 } : c)));
    socket.emit("markAsRead", { conversationId: convo._id, readerRole: "admin", receiverId: convo.user?._id || convo.user });

    await loadOrdersForUser(convo.user);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const formatTime = (date) => new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const sendMessage = async () => {
    if ((!text.trim() && !image) || !selectedConvo) return;

    const formData = new FormData();
    formData.append("conversationId", selectedConvo._id);
    formData.append("message", text);
    formData.append("senderRole", "admin");
    if (image) formData.append("image", image);

    try {
      const res = await api.post("/chat/messages", formData);

      socket.emit("sendMessage", {
        conversationId: selectedConvo._id,
        senderId: "admin",
        senderRole: "admin",
        message: res.data.message,
        image: res.data.image,
        receiverId: selectedConvo.user._id,
      });

      setText("");
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Failed to send:", err);
      toast.error("Failed to send message", { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await api.delete(`/chat/messages/${messageId}`);
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
      socket.emit("deleteMessage", {
        messageId,
        conversationId: selectedConvo._id,
        receiverId: selectedConvo.user._id,
      });
    } catch (err) {
      console.error("Failed to delete:", err);
      toast.error("Failed to delete message", { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
    }
  };

  const copyEmail = () => {
    if (!selectedConvo?.user?.email) return;
    navigator.clipboard.writeText(selectedConvo.user.email);
    toast.success("Email copied to clipboard", { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
  };

  const isBlocked = selectedConvo?.user?.role === "blocked";
  const isPinned = selectedConvo && pinnedIds.includes(selectedConvo._id);
  const isMuted = selectedConvo && mutedIds.includes(selectedConvo._id);

  const toggleBlockCustomer = async () => {
    if (!selectedConvo?.user?._id) return;

    const willBlock = !isBlocked;
    const confirmMsg = willBlock
      ? `Block ${selectedConvo.user?.name || "this customer"}? They won't be able to send messages.`
      : `Unblock ${selectedConvo.user?.name || "this customer"}? They will be able to send messages again.`;

    if (!window.confirm(confirmMsg)) return;

    setBlockLoading(true);
    try {
      await api.put(`/Admin/user/${selectedConvo.user._id}`, {
        role: willBlock ? "blocked" : "user",
      });

      setSelectedConvo((prev) =>
        prev ? { ...prev, user: { ...prev.user, role: willBlock ? "blocked" : "user" } } : prev
      );
      setConversations((prev) =>
        prev.map((c) =>
          c._id === selectedConvo._id
            ? { ...c, user: { ...c.user, role: willBlock ? "blocked" : "user" } }
            : c
        )
      );

      toast.success(willBlock ? "Customer blocked" : "Customer unblocked", { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
    } catch (err) {
      console.error("Block/unblock error:", err?.response?.data || err.message);
      toast.error(willBlock ? "Failed to block customer" : "Failed to unblock customer", { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
    } finally {
      setBlockLoading(false);
    }
  };

  // ---------- Delete Conversation (with fallback + real error surfaced) ----------
  const deleteConversation = async () => {
    if (!selectedConvo?._id) return;
    if (
      !window.confirm(
        `Delete this entire conversation with ${selectedConvo.user?.name || "this customer"}? This cannot be undone.`
      )
    )
      return;

    setDeleteLoading(true);
    try {
      await api.delete(`/chat/admin/conversation/${selectedConvo._id}`);
      setConversations((prev) => prev.filter((c) => c._id !== selectedConvo._id));
      setPinnedIds((prev) => prev.filter((id) => id !== selectedConvo._id));
      setMutedIds((prev) => prev.filter((id) => id !== selectedConvo._id));
      setMessages([]);
      setSelectedConvo(null);
      setShowInfoPanel(false);
      toast.success("Conversation deleted", { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
    } catch (err) {
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.message;
      console.error("Delete conversation failed:", status, serverMsg || err.message);

      if (status === 404) {
        toast.error("Delete route not found on server (check backend endpoint).", { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
      } else if (status === 401 || status === 403) {
        toast.error("Not authorized to delete this conversation.", { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
      } else {
        toast.error(serverMsg || "Failed to delete conversation. Check console for details.", { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  // ---------- New: Clear Chat (keeps conversation, wipes messages) ----------
  const clearChat = async () => {
    if (!selectedConvo?._id) return;
    if (!window.confirm("Clear all messages in this chat? The conversation itself will stay.")) return;

    setClearLoading(true);
    try {
      await api.delete(`/chat/admin/conversation/${selectedConvo._id}/messages`);
      setMessages([]);
      setConversations((prev) =>
        prev.map((c) => (c._id === selectedConvo._id ? { ...c, lastMessage: "" } : c))
      );
      toast.success("Chat cleared", { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
    } catch (err) {
      console.error("Clear chat failed:", err?.response?.data || err.message);
      toast.error("Failed to clear chat. Check backend endpoint.", { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
    } finally {
      setClearLoading(false);
    }
  };

  // ---------- New: Pin / Unpin ----------
  const togglePin = () => {
    if (!selectedConvo?._id) return;
    setPinnedIds((prev) => {
      const updated = isPinned ? prev.filter((id) => id !== selectedConvo._id) : [...prev, selectedConvo._id];
      localStorage.setItem("pinnedConvos", JSON.stringify(updated));
      return updated;
    });
    toast.success(isPinned ? "Unpinned conversation" : "Pinned conversation", { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
    setShowMenu(false);
  };

  // ---------- New: Mute / Unmute notifications ----------
  const toggleMute = () => {
    if (!selectedConvo?._id) return;
    setMutedIds((prev) => {
      const updated = isMuted ? prev.filter((id) => id !== selectedConvo._id) : [...prev, selectedConvo._id];
      localStorage.setItem("mutedConvos", JSON.stringify(updated));
      return updated;
    });
    toast.success(isMuted ? "Notifications unmuted" : "Notifications muted for this chat", { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
    setShowMenu(false);
  };

  // ---------- New: Export chat as .txt ----------
  const exportChat = () => {
    if (!selectedConvo || messages.length === 0) {
      toast.info("No messages to export", { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
      return;
    }
    const lines = messages.map((m) => {
      const who = m.senderRole === "admin" ? "Admin" : selectedConvo.user?.name || "Customer";
      const time = m.createdAt ? new Date(m.createdAt).toLocaleString() : "";
      const body = m.message || (m.image?.url ? "[Image attachment]" : "");
      return `[${time}] ${who}: ${body}`;
    });
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${selectedConvo.user?.name || "customer"}-${selectedConvo._id.slice(-6)}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success("Chat exported", { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
    setShowMenu(false);
  };

  // ---------- New: Mark conversation as unread ----------
  const markAsUnread = () => {
    if (!selectedConvo?._id) return;
    setConversations((prev) =>
      prev.map((c) => (c._id === selectedConvo._id ? { ...c, unreadByAdmin: (c.unreadByAdmin || 0) + 1 } : c))
    );
    toast.success("Marked as unread",{ position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
    setShowMenu(false);
  };

  const filteredConvos = conversations
    .filter((c) => c.user?.name?.toLowerCase().includes(search.toLowerCase()))
    .filter((c) => {
      if (filterTab === "unread") return c.unreadByAdmin > 0;
      if (filterTab === "blocked") return c.user?.role === "blocked";
      if (filterTab === "pinned") return pinnedIds.includes(c._id);
      return true;
    })
    .sort((a, b) => {
      const aPinned = pinnedIds.includes(a._id) ? 1 : 0;
      const bPinned = pinnedIds.includes(b._id) ? 1 : 0;
      return bPinned - aPinned;
    });

  const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || o.totalAmount || 0), 0);

  const Avatar = ({ user, size = "w-10 h-10", ring = false }) =>
    user?.avatar?.url ? (
      <img
        src={user.avatar.url}
        alt={user.name}
        className={`${size} rounded-full object-cover flex-shrink-0 ${ring ? "ring-4 ring-white shadow-lg" : "border-2 border-white shadow-sm"
          }`}
      />
    ) : (
      <div
        className={`${size} rounded-full bg-gradient-to-br from-[#0E5D33] to-[#127a43] text-white flex items-center justify-center font-semibold flex-shrink-0 shadow-md ${ring ? "ring-4 ring-white shadow-lg" : ""
          }`}
      >
        {user?.name?.charAt(0)?.toUpperCase() || "C"}
      </div>
    );

  const filterTabs = [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "pinned", label: "Pinned" },
    { key: "blocked", label: "Blocked" },
  ];

  return (
    <div className="flex h-[calc(100vh-3rem)] sm:h-[88vh]  sm:m-5 mt-12 pt-12 sm:mt-20  bg-white sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative">
      {/* ---------- Conversation List ---------- */}
      <div className={`${selectedConvo ? "hidden sm:flex" : "flex"} w-full sm:w-[300px] border-r border-gray-100 flex-col bg-gradient-to-b from-gray-50 to-white`}>
        <div className="relative p-5 border-b border-gray-100 bg-gradient-to-br from-[#0E5D33] to-[#127a43] overflow-hidden">
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute -bottom-10 -left-6 w-20 h-20 bg-white/10 rounded-full" />
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-inner">
              <FiMessageCircle size={16} />
            </div>
            <h2 className="font-bold text-white text-lg tracking-tight">Messages</h2>
          </div>
          <div className="relative z-10">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer..."
              className="w-full text-sm pl-9 pr-3 py-2.5 rounded-full bg-white outline-none focus:ring-2 focus:ring-white/60 shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 px-3 py-2.5 border-b border-gray-100 overflow-x-auto">
          {filterTabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilterTab(t.key)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer ${filterTab === t.key
                  ? "bg-[#0E5D33] text-white shadow-sm"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          {filteredConvos.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center mt-16 px-6">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-3 text-gray-400">
                <FiMessageCircle size={24} />
              </div>
              <p className="text-gray-400 text-sm">No conversations found</p>
            </div>
          )}
          {filteredConvos.map((c) => (
            <div
              key={c._id}
              onClick={() => openConversation(c)}
              className={`relative flex items-center gap-3 px-3 py-3 mb-1 rounded-2xl cursor-pointer transition-all duration-200 ${selectedConvo?._id === c._id ? "bg-[#0E5D33]/10 shadow-sm" : "hover:bg-gray-100 active:bg-gray-100"
                }`}
            >
              {selectedConvo?._id === c._id && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-[#0E5D33]" />
              )}
              <Avatar user={c.user} />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-center gap-2">
                  <p className="font-semibold text-sm text-gray-800 truncate flex items-center gap-1">
                    {pinnedIds.includes(c._id) && <BsPinAngleFill size={11} className="text-[#0E5D33] flex-shrink-0" />}
                    {c.user?.name || "Customer"}
                    {c.user?.role === "blocked" && (
                      <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">
                        BLOCKED
                      </span>
                    )}
                    {mutedIds.includes(c._id) && <FiBellOff size={11} className="text-gray-400 flex-shrink-0" />}
                  </p>
                  {c.unreadByAdmin > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 flex-shrink-0 shadow-sm">
                      {c.unreadByAdmin}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">{c.lastMessage || "No messages yet"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Chat Area ---------- */}
      <div className={`${selectedConvo ? "flex" : "hidden sm:flex"} flex-1 flex-col min-w-0`}>
        {selectedConvo ? (
          <>
            <div className="relative flex items-center justify-between gap-2 px-3 sm:px-5 py-3.5 border-b border-gray-100 bg-gradient-to-br from-[#0E5D33] to-[#127a43] shadow-sm z-10">
              <div className="absolute -top-10 -right-6 w-24 h-24 bg-white/10 rounded-full overflow-hidden pointer-events-none" />

              <button
                onClick={() => setSelectedConvo(null)}
                className="sm:hidden text-white/90 hover:text-white p-1 -ml-1 relative z-10"
                aria-label="Back to conversations"
              >
                <FiChevronLeft size={20} />
              </button>

              <div className="relative z-10">
                <Avatar user={selectedConvo.user} size="w-10 h-10" />
              </div>

              <div className="min-w-0 flex-1 overflow-hidden relative z-10">
                <p className="font-semibold text-sm text-white truncate flex items-center gap-1.5">
                  {selectedConvo.user?.name || "Customer"}
                  {isPinned && <BsPinAngleFill size={12} className="text-white/90" />}
                  {isMuted && <FiBellOff size={12} className="text-white/70" />}
                  {isBlocked && (
                    <span className="text-[9px] font-bold text-white bg-red-500/80 px-1.5 py-0.5 rounded-full">
                      BLOCKED
                    </span>
                  )}
                </p>
                <p className="text-xs text-green-100 truncate">{selectedConvo.user?.email}</p>
              </div>

              <button
                onClick={() => setShowInfoPanel(true)}
                className="sm:hidden text-white/90 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors flex-shrink-0 relative z-10"
                aria-label="Customer details"
              >
                <FiInfo size={19} />
              </button>

              {/* Kebab menu with new actions */}
              <div className="relative z-10" ref={menuRef}>
                <button
                  onClick={() => setShowMenu((v) => !v)}
                  className="text-white/90 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
                  aria-label="More options"
                >
                  <FiMoreVertical size={19} />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-11 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-30">
                    <button
                      onClick={togglePin}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {isPinned ? <BsPinAngleFill size={13} /> : <BsPinAngle size={13} />}
                      {isPinned ? "Unpin conversation" : "Pin conversation"}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {isMuted ? <FiBell size={13} /> : <FiBellOff size={13} />}
                      {isMuted ? "Unmute notifications" : "Mute notifications"}
                    </button>
                    <button
                      onClick={markAsUnread}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FiMessageCircle size={13} /> Mark as unread
                    </button>
                    <button
                      onClick={exportChat}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FiDownload size={13} /> Export chat (.txt)
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={() => { setShowMenu(false); clearChat(); }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-amber-600 hover:bg-amber-50 transition-colors"
                    >
                      <FiRefreshCcw size={13} /> Clear chat
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-5 bg-gray-50 space-y-3">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <div className="w-14 h-14 rounded-full bg-[#0E5D33]/10 flex items-center justify-center text-2xl mb-3 text-[#0E5D33]">
                    <FiMessageCircle size={24} />
                  </div>
                  <p className="text-gray-400 text-sm">No messages yet with this customer</p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.senderRole === "admin" ? "justify-end" : "justify-start"} group`}>
                  <div className={`flex flex-col ${m.senderRole === "admin" ? "items-end" : "items-start"} max-w-[80%] sm:max-w-[60%]`}>
                    <div className="flex items-center gap-1.5">
                      {m.senderRole === "admin" && m._id && (
                        <button
                          onClick={() => deleteMessage(m._id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all cursor-pointer hover:scale-110"
                          title="Delete message"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      )}
                      <div className="flex flex-col items-end">
                        {m.image?.url && (
                          <img src={m.image.url} alt="attachment" className="rounded-2xl mb-1 max-w-full max-h-56 object-cover shadow-md" />
                        )}
                        {m.message && (
                          <span
                            className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm break-words leading-relaxed ${m.senderRole === "admin"
                                ? "bg-gradient-to-br from-[#0E5D33] to-[#127a43] text-white rounded-br-md"
                                : "bg-white text-gray-800 rounded-bl-md border border-gray-100"
                              }`}
                          >
                            {m.message}
                          </span>
                        )}
                      </div>
                      {m.senderRole !== "admin" && m._id && (
                        <button
                          onClick={() => deleteMessage(m._id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all cursor-pointer hover:scale-110"
                          title="Delete message"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 px-1">
                      {m.createdAt ? formatTime(m.createdAt) : ""}
                      {m.senderRole === "admin" && (
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
              <div className="px-4 pt-3 bg-white border-t border-gray-50">
                <div className="relative inline-block">
                  <img src={imagePreview} alt="preview" className="w-16 h-16 object-cover rounded-xl border border-gray-200 shadow-sm" />
                  <button
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md transition-colors cursor-pointer"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 border-t border-gray-100 p-3 bg-white">
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-500 hover:text-[#0E5D33] transition-colors px-2.5 py-2.5 rounded-full hover:bg-gray-100 cursor-pointer flex-shrink-0"
                title="Attach image"
              >
                <FiPaperclip size={19} />
              </button>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Reply to customer..."
                className="flex-1 min-w-0 text-sm px-4 py-2.5 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-[#0E5D33]/40 focus:bg-white transition-all"
              />
              <button
                onClick={sendMessage}
                className="bg-gradient-to-br from-[#0E5D33] to-[#127a43] hover:shadow-lg active:scale-95 text-white p-3 rounded-full shadow-md transition-all cursor-pointer flex-shrink-0 flex items-center justify-center"
              >
                <FiSend size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 hidden sm:flex items-center justify-center text-gray-400 text-sm flex-col gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <FiMessageCircle size={28} />
            </div>
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>

      {/* ---------- Customer Info Panel ---------- */}
      {selectedConvo && (
        <>
          {showInfoPanel && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20" onClick={() => setShowInfoPanel(false)} />
          )}
          <div className={`w-[300px] bg-white overflow-y-auto fixed lg:static top-25 lg:top-0 right-0 h-[calc(100%-4rem)] lg:h-full z-30 lg:z-auto shadow-2xl lg:shadow-none lg:border-l lg:border-gray-100 transition-transform duration-300${showInfoPanel ? "translate-x-0" : "translate-x-full lg:translate-x-0"}${!showInfoPanel && "lg:flex lg:flex-col hidden lg:block"}`}>

            <div className="relative bg-gradient-to-br from-[#0E5D33] to-[#127a43] pt-6 pb-14 px-5 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
              <div className="absolute top-10 -left-8 w-20 h-20 bg-white/10 rounded-full" />
              <button
                onClick={() => setShowInfoPanel(false)}
                className="lg:hidden text-white/90 hover:text-white flex items-center gap-1 text-sm relative z-10"
              >
                <FiChevronLeft size={16} /> Close
              </button>
              <p className="text-white/80 text-xs font-medium tracking-wide relative z-10 mt-1">CUSTOMER PROFILE</p>
            </div>

            <div className="flex flex-col items-center text-center -mt-12 pt-16 px-5 ">
              <Avatar user={selectedConvo.user} size="w-20 h-20" ring />
              <p className="font-bold text-gray-800 mt-3 text-base">{selectedConvo.user?.name || "Customer"}</p>

              <button
                onClick={copyEmail}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#0E5D33] transition-colors mt-1 group cursor-pointer"
                title="Copy email"
              >
                <FiMail size={12} />
                {selectedConvo.user?.email}
                <FiCopy size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {selectedConvo.user?.phone && (
                <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                  <FiPhone size={12} /> {selectedConvo.user.phone}
                </p>
              )}

              <span
                className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full mt-2 ${isBlocked ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"
                  }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isBlocked ? "bg-red-500" : "bg-green-500"}`} />
                {isBlocked ? "Blocked Customer" : "Verified Customer"}
              </span>
            </div>

            <div className="px-5 mt-6">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-4 border border-blue-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white mb-2 shadow-sm">
                    <FiPackage size={15} />
                  </div>
                  <p className="text-gray-500 text-[11px] mb-0.5">Total Orders</p>
                  <p className="text-gray-800 font-bold text-xl">{loadingOrders ? "…" : orders.length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-4 border border-green-100">
                  <div className="w-8 h-8 rounded-lg bg-[#0E5D33] flex items-center justify-center text-white mb-2 shadow-sm">
                    PKR
                  </div>
                  <p className="text-gray-500 text-[11px] mb-0.5">Total Spent</p>
                  <p className="text-[#0E5D33] font-bold text-xl">
                    {loadingOrders ? "…" : `${totalSpent >= 1000 ? (totalSpent / 1000).toFixed(1) + "k" : totalSpent}`}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0 text-gray-500">
                  <FiCalendar size={16} />
                </div>
                <div>
                  <p className="text-gray-400 text-[11px]">Customer Since</p>
                  <p className="text-gray-800 font-semibold text-sm">
                    {selectedConvo.user?.createdAt
                      ? new Date(selectedConvo.user.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={toggleBlockCustomer}
                  disabled={blockLoading}
                  className={`flex items-center justify-center gap-1.5 text-xs font-medium rounded-xl py-2.5 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${isBlocked
                      ? "text-green-700 bg-green-50 hover:bg-green-100"
                      : "text-red-600 bg-red-50 hover:bg-red-100"
                    }`}
                >
                  {isBlocked ? <FiUserCheck size={13} /> : <FiSlash size={13} />}
                  {blockLoading ? "..." : isBlocked ? "Unblock" : "Block"}
                </button>
                <button
                  onClick={copyEmail}
                  className="flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl py-2.5 transition-colors cursor-pointer"
                >
                  <FiCopy size={13} /> Copy Email
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={togglePin}
                  className="flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl py-2.5 transition-colors cursor-pointer"
                >
                  {isPinned ? <BsPinAngleFill size={13} /> : <BsPinAngle size={13} />}
                  {isPinned ? "Unpin" : "Pin"}
                </button>
                <button
                  onClick={toggleMute}
                  className="flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl py-2.5 transition-colors cursor-pointer"
                >
                  {isMuted ? <FiBell size={13} /> : <FiBellOff size={13} />}
                  {isMuted ? "Unmute" : "Mute"}
                </button>
              </div>

              <button
                onClick={exportChat}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl py-2.5 transition-colors cursor-pointer mb-2"
              >
                <FiDownload size={13} /> Export Chat
              </button>

              <button
                onClick={clearChat}
                disabled={clearLoading}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl py-2.5 transition-colors cursor-pointer mb-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <FiRefreshCcw size={13} />
                {clearLoading ? "Clearing..." : "Clear Chat"}
              </button>

              <button
                onClick={deleteConversation}
                disabled={deleteLoading}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl py-2.5 transition-colors cursor-pointer mb-5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <FiTrash2 size={13} />
                {deleteLoading ? "Deleting..." : "Delete Conversation"}
              </button>

              {!loadingOrders && ordersError && (
                <div className="flex flex-col items-center text-center bg-red-50 rounded-2xl p-4 border border-red-100 mb-5">
                  <p className="text-xs text-red-500 mb-2">{ordersError}</p>
                  <button
                    onClick={() => loadOrdersForUser(selectedConvo.user)}
                    className="text-[11px] font-medium text-red-600 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-full cursor-pointer flex items-center gap-1"
                  >
                    <FiRefreshCcw size={11} /> Retry
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminChatPanel;