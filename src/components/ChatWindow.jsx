
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import { BASE_URL } from "../constants";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ChatWindow({ typing = false }) {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const { name } = location.state || {};
  const listRef = useRef(null);
  const targetUserId = useParams().targetUserId;
  const loggedInUser = useSelector((store) => store.user);
  const loggedInUserId = loggedInUser?._id;
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchChat = async () => {
    try {
      const chats = await axios.post(
        `${BASE_URL}/chat`,
        {
          targetUserId: targetUserId,
        },
        {
          withCredentials: true,
        }
      );
      const chatMessages = chats?.data?.messages.map((msg) => ({
        from: `${msg?.sender.firstName}`,
        senderId: msg?.sender._id,
        message: msg?.message,
      }));
      setMessages(chatMessages);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchParticipants = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/participants`, {
        withCredentials: true,
      });
      setParticipants(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (targetUserId) {
      fetchChat();
    }
    fetchParticipants();
  }, [targetUserId]);

  useEffect(() => {
    if (!loggedInUserId || !targetUserId) {
      return;
    }
    const socket = createSocketConnection();
    socket.emit("joinChat", { loggedInUserId, targetUserId });
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      fetchParticipants();
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
    setNewMessage("");
    fetchParticipants();
  };
  return (
    <div className="w-full bg-base-100 rounded-lg flex flex-col">
      <main className="flex">
        <aside className="hidden md:block md:w-56 bg-base-100 p-3 overflow-auto">
          <div className="text-xs text-muted mb-2 text-xl">Participants</div>
          {participants?.map((participant) => (
            <Link
              key={participant._id.toString()}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 cursor-pointer"
              to={`/chat/${participant?.participant?._id}`}
              state={{ name: participant?.participant?.firstName }}
            >
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-content">
                {participant?.participant?.firstName?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="font-medium">
                  {participant?.participant?.firstName}
                </div>
                <div className="text-sm text-muted">
                  {participant?.lastMessage?.message || "No messages yet"}
                </div>
              </div>
            </Link>
          ))}
        </aside>
        {/* Message list */}
        <section className="flex-1 flex flex-col max-h-[80vh] p-4 pt-0 pl-0 min-h-[80vh] border-l border-gray-300">
          {targetUserId ? (
            <div className="flex flex-col h-full">
              <div ref={listRef} className="flex-1 space-y-4 pb-4">
                <header className="flex items-center gap-3 z-10 bg-base-100 w-full h-16 border-b border-gray-300 bg-white m-0">
                  <div className="flex items-center gap-3 p-2">
                    <p className="text-xl">{name}</p>
                  </div>
                </header>

                {messages.length === 0 && (
                  <div className="text-center opacity-60 mt-12">
                    No messages yet — say hi 👋
                  </div>
                )}
                <div className="overflow-y-auto max-h-[65vh] bg-cover bg-center rounded-lg p-4">
                  {messages.map((m, index) => (
                    <MessageBubble
                      key={index}
                      message={m}
                      loggedInUserId={loggedInUserId}
                    />
                  ))}
                </div>

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
                          handleSend();
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
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-3xl">Say hello!</p>
            </div>
          )}
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
