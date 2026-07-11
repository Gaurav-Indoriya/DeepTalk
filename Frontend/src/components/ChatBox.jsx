import React, { useEffect, useState, useRef } from "react";
import socket from "../socket";
import {
  getMessages,
  sendMessage as sendMessageApi,
  markAsRead,
  clearChat as clearChatApi
} from "../services/UserServices";

const ChatBox = ({ selectedUser }) => {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearing, setClearing] = useState(false);

  const typingTimeoutRef = useRef(null);
  const menuRef = useRef(null);

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    socket.connect();
    socket.emit("join", currentUser.ID);
    //console.log("Joined Room:", currentUser.ID);
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    setMessages([]);
    setIsTyping(false);
    loadMessages();
  }, [selectedUser]);

  useEffect(() => {
    socket.on("receive-message", (data) => {
      if (!selectedUser) return;
      if (
        data.senderId === selectedUser.ID ||
        data.receiverId === selectedUser.ID
      ) {
        loadMessages();
      }
    });
    return () => {
      socket.off("receive-message");
    };
  }, [selectedUser]);

  useEffect(() => {
    socket.on("reload-seen", () => {
      loadMessages();
    });
    return () => {
      socket.off("reload-seen");
    };
  }, [selectedUser]);

  // ---------- TYPING LISTENERS ----------
  useEffect(() => {
    const handleShowTyping = (data) => {
      if (selectedUser && data.senderId === selectedUser.ID) {
        setIsTyping(true);
      }
    };

    const handleHideTyping = (data) => {
      if (selectedUser && data.senderId === selectedUser.ID) {
        setIsTyping(false);
      }
    };

    socket.on("show-typing", handleShowTyping);
    socket.on("hide-typing", handleHideTyping);

    return () => {
      socket.off("show-typing", handleShowTyping);
      socket.off("hide-typing", handleHideTyping);
    };
  }, [selectedUser]);

  // ---------- CLOSE MENU ON OUTSIDE CLICK ----------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // -------------------------------------

  const loadMessages = async () => {
    if (!selectedUser) return;
    try {
      const receiverId = selectedUser.ID;
      await markAsRead(receiverId, currentUser.ID);
      socket.emit("message-seen", {
        senderId: receiverId,
        receiverId: currentUser.ID
      });
      const response = await getMessages(currentUser.ID, receiverId);
      socket.emit("refresh-unread", currentUser.ID);
      setMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!selectedUser) return;

    socket.emit("typing", {
      senderId: currentUser.ID,
      senderName: currentUser.NAME,
      receiverId: selectedUser.ID
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", {
        senderId: currentUser.ID,
        receiverId: selectedUser.ID
      });
    }, 1500);
  };

  const sendMessage = async () => {
    if (message.trim() === "") return;

    try {
      await sendMessageApi(currentUser.ID, selectedUser.ID, message);

      socket.emit("send-message", {
        senderId: currentUser.ID,
        receiverId: selectedUser.ID,
        message
      });

      socket.emit("stop-typing", {
        senderId: currentUser.ID,
        receiverId: selectedUser.ID
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      setMessage("");
      await loadMessages();
    } catch (error) {
      console.log(error);
    }
  };

  // ---------- CLEAR CHAT ----------
  const handleClearChat = async () => {
    setClearing(true);
    try {
      await clearChatApi(currentUser.ID, selectedUser.ID);

      // Notify the other user to reload
      socket.emit("refresh-unread", currentUser.ID);

      setMessages([]);
      setShowClearModal(false);
    } catch (error) {
      console.log(error);
    } finally {
      setClearing(false);
    }
  };
  // -------------------------------

  if (!selectedUser) {
    return (
      <div className="flex-1 bg-slate-950 flex items-center justify-center">
        <div className="text-center text-slate-500">
          <i className="fa-solid fa-comments text-7xl mb-6"></i>
          <h2 className="text-3xl font-bold text-white">
            Welcome to DeepTalk
          </h2>
          <p className="mt-3">
            Search a user or select a contact to start chatting.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-950 flex flex-col">

      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center">
              <i className="fa-solid fa-user text-blue-500 text-xl"></i>
            </div>
            <span
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-900 ${
                Number(selectedUser?.ONLINE) === 1 || selectedUser?.ONLINE === true
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              {selectedUser.NAME}
            </h2>
            <p
              className={`text-sm ${
                isTyping
                  ? "text-blue-400"
                  : selectedUser?.ONLINE
                  ? "text-green-500"
                  : "text-slate-400"
              }`}
            >
              {isTyping
                ? "typing..."
                : selectedUser?.ONLINE
                ? "Online"
                : `@${selectedUser?.USERNAME}`}
              {isTyping && (
                <span className="inline-flex items-center gap-0.5 ml-1">
                  <span className="h-1 w-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-1 w-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-1 w-1 bg-blue-400 rounded-full animate-bounce"></span>
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Three-dots menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="text-slate-400 hover:text-white text-xl cursor-pointer p-2 rounded-lg hover:bg-slate-800 transition"
          >
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </button>

          {showMenu && (
            <div className="absolute right-0 top-12 z-50 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
              <button
                onClick={() => {
                  setShowMenu(false);
                  setShowClearModal(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-slate-700 transition"
              >
                <i className="fa-solid fa-trash"></i>
                Clear Chat
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">

        {messages.length === 0 && !isTyping && (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-600 text-sm">
              No messages yet. Say hello!
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.ID}
            className={`flex ${
              msg.SENDER_ID === currentUser.ID ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`inline-block max-w-[70%] px-3 py-2 rounded-2xl shadow ${
                msg.SENDER_ID === currentUser.ID
                  ? "bg-blue-600 text-white rounded-br-md"
                  : "bg-slate-800 text-white rounded-bl-md"
              }`}
            >
              <p className="text-[15px] break-words">
                {msg.MESSAGE}
              </p>
              <div className="flex justify-end items-center gap-1 mt-1">
                <span className="text-[10px] opacity-80">
                  {new Date(msg.CREATED_AT).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                  })}
                </span>
                {msg.SENDER_ID === currentUser.ID && (
                  msg.IS_READ ? (
                    <i className="fa-solid fa-check-double text-[10px] text-blue-200"></i>
                  ) : (
                    <i className="fa-solid fa-check text-[10px]"></i>
                  )
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing bubble */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Input */}
      <div className="bg-slate-900 border-t border-slate-800 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={handleTyping}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 bg-slate-800 rounded-xl px-5 py-3 outline-none border border-slate-700 focus:border-blue-500 text-white"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 px-6 rounded-xl transition"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>

      {/* Clear Chat Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-red-600/20 flex items-center justify-center mb-4">
                <i className="fa-solid fa-trash text-red-500 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Clear Chat?
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                All messages with{" "}
                <span className="text-white font-semibold">
                  {selectedUser.NAME}
                </span>{" "}
                Both side chat will be permanently deleted.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowClearModal(false)}
                  disabled={clearing}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-xl transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearChat}
                  disabled={clearing}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {clearing ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      Clearing...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-trash"></i>
                      Clear
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ChatBox;
