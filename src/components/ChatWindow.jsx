// Responsive Chat Window component (React) using JSX with Tailwind CSS + DaisyUI

import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";

export default function ChatWindow({
  title = "Chat",
  subtitle = "Online",
  typing = false,
}) {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const { name } = location.state || {};
  const listRef = useRef(null);
  const targetUserId = useParams().targetUserId;
  const loggedInUser = useSelector((store) => store.user);
  const loggedInUserId = loggedInUser?._id;
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!loggedInUserId || !targetUserId) {
      return;
    }
    const socket = createSocketConnection();
    socket.emit("joinChat", { loggedInUserId, targetUserId });
    socket.on("receiveMessage", (message) => {
      console.log("Message received: ", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
      socket.disconnect();
    };
  }, [loggedInUserId, targetUserId]);

  const handleSend = () => {
    if (newMessage.trim() === "") return;
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: loggedInUser.firstName,
      loggedInUserId,
      targetUserId,
      message: newMessage,
    });
    // setMessages((prevMessages) => [
    //   ...prevMessages,
    //   {
    //     message: newMessage,
    //     from: loggedInUser.firstName,
    //     senderId: loggedInUserId,
    //   },
    // ]);
    setNewMessage("");
  };
  return (
    <div className="w-full max-w-4xl mx-auto h-[80vh] md:h-[70vh] bg-base-100 shadow-lg rounded-lg overflow-scroll flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b bg-base-200">
        <div className="avatar">
          <div className="w-10 h-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
            {title.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm md:text-base truncate">
            {title}
          </div>
          <div className="text-xs opacity-70 truncate">{subtitle}</div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <button className="btn btn-ghost btn-sm">Details</button>
          <button className="btn btn-ghost btn-sm">Search</button>
          <button className="btn btn-ghost btn-sm">Close</button>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 md:flex md:flex-row min-h-0">
        {/* Sidebar */}
        <aside className="hidden md:block md:w-56 border-r bg-base-100 p-3 overflow-auto">
          <div className="text-xs text-muted mb-2">Participants</div>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <div className="avatar">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  T
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">Teammate</div>
                <div className="text-xs opacity-60 truncate">
                  Last seen 2h ago
                </div>
              </div>
            </li>
            <li className="flex items-center gap-2">
              <div className="avatar">
                <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center">
                  A
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">Admin</div>
                <div className="text-xs opacity-60 truncate">Online</div>
              </div>
            </li>
          </ul>
        </aside>

        {/* Message list */}
        <section className="flex-1 p-3 md:p-6 flex flex-col min-h-0">
          <div ref={listRef} className="flex-1 overflow-auto space-y-4 pb-4">
            <p className="text-xl">{name}</p>
            {messages.length === 0 && (
              <div className="text-center opacity-60 mt-12">
                No messages yet — say hi 👋
              </div>
            )}

            {messages.map((m, index) => (
              <MessageBubble
                key={index}
                message={m}
                loggedInUserId={loggedInUserId}
              />
              //   <p>{message.message}</p>
            ))}

            {typing && (
              <div className="flex items-center gap-2">
                <div className="avatar">
                  <div className="w-8 h-8 rounded-full bg-accent text-accent-content flex items-center justify-center">
                    T
                  </div>
                </div>
                <div className="bg-base-200 px-3 py-2 rounded-lg text-sm">
                  Typing<span className="animate-pulse">...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="mt-3 md:mt-4">
            <div className="flex items-end gap-2">
              <button
                className="btn btn-ghost btn-square md:hidden"
                aria-label="open menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <div className="flex-1">
                <textarea
                  rows={1}
                  placeholder="Write a message... (Enter to send, Shift+Enter for newline)"
                  className="textarea textarea-bordered w-full resize-none min-h-[44px] max-h-36"
                  aria-label="Message input"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend()
                    }
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="btn btn-square" title="Attach file">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828a4 4 0 10-5.656-5.657L6.343 10.172a6 6 0 108.485 8.485L21 12.485"
                    />
                  </svg>
                </label>

                <button
                  onClick={handleSend}
                  className="btn btn-primary"
                  aria-label="Send message"

                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function MessageBubble({ message, loggedInUserId }) {
  return (
    <div
      className={`flex ${
        message.senderId === loggedInUserId ? "justify-end" : "justify-start"
      }`}
    >
      <div className="max-w-[80%] md:max-w-[60%]">
        <div className="chat chat-start">
          <div className="chat-header">
            {message.from}
            <time className="text-xs opacity-50">2 hours ago</time>
          </div>
          <div className="chat-bubble"> {message.message}</div>
          <div className="chat-footer opacity-50">Seen</div>
        </div>
      </div>
    </div>
  );
}
