import { useEffect, useRef, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import { BASE_URL } from "../constants";
import axios from "axios";

export default function ChatWindow({ typing = false }) {
  const location = useLocation();
  const { name } = location.state || {};
  const targetUserId = useParams().targetUserId;
  const loggedInUser = useSelector((store) => store.user);
  const loggedInUserId = loggedInUser?._id;

  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const listRef = useRef(null);

  // Auto-scroll messages
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch chat messages
  const fetchChat = async () => {
    try {
      const chats = await axios.post(
        `${BASE_URL}/chat`,
        { targetUserId },
        { withCredentials: true }
      );
      const chatMessages = chats?.data?.messages.map((msg) => ({
        from: msg?.sender.firstName,
        senderId: msg?.sender._id,
        message: msg?.message,
      }));
      setMessages(chatMessages);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch participants
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

  // Initial fetch
  useEffect(() => {
    if (targetUserId) fetchChat();
    fetchParticipants();
  }, [targetUserId]);

  // Socket connection
  useEffect(() => {
    if (!loggedInUserId || !targetUserId) return;

    const socket = createSocketConnection();
    socket.emit("joinChat", { loggedInUserId, targetUserId });

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
      fetchParticipants();
    });

    return () => socket.disconnect();
  }, [loggedInUserId, targetUserId]);

  // Send message
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
    <div className="flex flex-col h-screen bg-base-100 overflow-hidden">
      {/* Mobile Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-300 md:hidden sticky top-0 bg-white z-20">
        <h1 className="text-lg font-semibold">Chat</h1>
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="btn btn-ghost btn-square"
          aria-label="Toggle participants"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`flex flex-col fixed md:static top-0 left-0 w-64 bg-base-100 border-r border-gray-300 h-full p-3 transform transition-transform duration-300 z-30 ${
            showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <h2 className="text-lg font-semibold mb-4">Participants</h2>
          <div className="flex-1 overflow-y-auto space-y-2 ">
            {participants?.map((participant) => (
              <Link
                key={participant._id}
                to={`/chat/${participant?.participant?._id}`}
                state={{ name: participant?.participant?.firstName }}
                onClick={() => setShowSidebar(false)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200"
              >
                <div className="w-10 h-10 rounded-full bg-accent text-accent-content flex items-center justify-center">
                  {participant?.participant?.firstName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">
                    {participant?.participant?.firstName}
                  </p>
                  <p className="text-sm text-gray-500 truncate w-40">
                    {participant?.lastMessage?.message || "No messages yet"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </aside>

        {/* Chat Section */}
        <section className="flex-1 flex flex-col bg-base-100">
          {targetUserId ? (
            <>
              {/* Chat Header */}
              <div className="sticky top-0 flex items-center gap-3 p-4 bg-white border-b border-gray-300 z-10">
                <div className="w-10 h-10 rounded-full bg-accent text-accent-content flex items-center justify-center text-lg">
                  {name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{name}</h2>
                  {typing && (
                    <p className="text-sm text-gray-500 animate-pulse">
                      Typing...
                    </p>
                  )}
                </div>
              </div>

              <div className="'flex-1 flex flex-col [@media(min-width:702px)]:h-[80vh] h-[65vh]">
                {/* Messages */}
                <div
                  ref={listRef}
                 className="overflow-y-auto px-4 py-3 bg-gray-50 h-[65vh] [@media(min-width:702px)]:h-[80vh]"

                >
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">
                      No messages yet — say hi 👋
                    </div>
                  ) : (
                    messages.map((m, index) => (
                      <MessageBubble
                        key={index}
                        message={m}
                        loggedInUserId={loggedInUserId}
                      />
                    ))
                  )}
                </div>

                {/* Input */}
                <div className="border-t border-gray-300 bg-white p-3 md:p-4">
                  <div className="flex items-end gap-2">
                    <textarea
                      rows={1}
                      placeholder="Write a message... (Enter to send)"
                      className="textarea textarea-bordered w-full resize-none rounded-xl min-h-[44px] max-h-32 text-base"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                    <button
                      onClick={handleSend}
                      className="btn btn-primary px-4 md:px-6 text-white"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center flex-1">
              <p className="text-2xl font-medium text-gray-500">
                Select a chat to start 💬
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Mobile Overlay */}
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          className="fixed inset-0 bg-black/40 md:hidden z-20"
        ></div>
      )}
    </div>
  );
}

function MessageBubble({ message, loggedInUserId }) {
  const isOwn = message.senderId === loggedInUserId;

  return (
    <div className={`flex mb-3 ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] md:max-w-[60%] p-3 rounded-2xl text-sm ${
          isOwn
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-200 text-gray-800 rounded-bl-none"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.message}</p>
      </div>
    </div>
  );
}
