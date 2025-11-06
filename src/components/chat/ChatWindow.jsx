import { useEffect, useRef, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { createSocketConnection } from "../../utils/socket";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../constants";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { CreateGroupChat } from "./CreateGroupChat";
import ImageKit from "./FileShare";
import MessageBubble from "./MessageBubble";
import { generateChatId } from "./utils";
import Menu from "@mui/material/Menu";
import GroupChatDetails from "./GroupChatDetails";

export default function ChatWindow() {
  const location = useLocation();

  const { name, isGroupChat, groupName } = location.state || {};

  const targetUserId = useParams().targetUserId;

  const loggedInUser = useSelector((store) => store.user);
  const loggedInUserId = loggedInUser?._id;
  const [groupChat, setGroupChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const listRef = useRef(null);
  const groupMenuRef = useRef(null);
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch chat messages
  const fetchChat = async () => {
    try {
      const chats = !isGroupChat
        ? await axios.post(
            `${BASE_URL}/chat`,
            { targetUserId },
            { withCredentials: true }
          )
        : await axios.post(
            `${BASE_URL}/chat/group`,
            { targetUserId },
            { withCredentials: true }
          );
      const chatMessages = chats?.data?.messages.map((msg) => ({
        timeStamp: msg?.createdAt,
        from: msg?.sender.firstName,
        senderId: msg?.sender._id,
        message: msg?.message,
        messageType: msg?.messageType,
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
  }, [targetUserId, isGroupChat]);

  // Socket connection
  useEffect(() => {
    if (!loggedInUserId || !targetUserId) return;

    const socket = createSocketConnection();
    if (!isGroupChat) {
      socket.emit("joinChat", generateChatId(loggedInUserId, targetUserId));
    } else {
      socket.emit("joinGroupChat", targetUserId);
    }

    if (isGroupChat) {
      socket.on("receiveGroupMessage", (message) => {
        setMessages((prev) => [...prev, message]);
        fetchParticipants();
      });
    } else {
      socket.on("receiveMessage", (message) => {
        setMessages((prev) => [...prev, message]);
        fetchParticipants();
      });
    }

    return () => socket.disconnect();
  }, [loggedInUserId, targetUserId]);

  // Send message
  const handleSend = (messageType = "text", customMessage) => {
    const messageToSend = customMessage || newMessage;
    if (messageToSend.trim() === "") return;
    const socket = createSocketConnection();
    if (isGroupChat) {
      socket.emit("sendMessageGroup", {
        chatId: targetUserId,
        firstName: loggedInUser.firstName,
        loggedInUserId,
        message: messageToSend,
        messageType,
      });
    } else {
      socket.emit("sendMessage", {
        firstName: loggedInUser.firstName,
        loggedInUserId,
        targetUserId,
        message: messageToSend,
        messageType,
      });
    }
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
          <div className="flex items-center justify-between mb-4">
            {groupChat && (
              <ArrowBackIcon
                onClick={() => {
                  setGroupChat(false);
                }}
                className="cursor-pointer"
              />
            )}

            <h2 className="text-lg font-semibold">Participants</h2>

            <GroupAddIcon
              onClick={() => setGroupChat(true)}
              className="cursor-pointer"
            />
          </div>

          {groupChat ? (
            <CreateGroupChat setGroupChat={setGroupChat} />
          ) : (
            <div className="flex-1 overflow-y-auto space-y-2 ">
              {participants?.map((participant) => (
                <Link
                  key={participant._id}
                  to={
                    participant?.isGroupChat
                      ? `/chat/${participant?._id}`
                      : `/chat/${participant?.participant?._id}`
                  }
                  state={{
                    name: participant?.participant?.firstName,
                    isGroupChat: participant?.isGroupChat,
                    groupName: participant?.groupName,
                  }}
                  onClick={() => setShowSidebar(false)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200"
                >
                  <div className="w-10 h-10 rounded-full bg-accent text-accent-content flex items-center justify-center">
                    {participant?.participant?.firstName
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium" id="group_details">
                      {participant?.isGroupChat
                        ? participant?.groupName
                        : participant?.participant?.firstName}
                    </p>

                    <p className="text-sm text-gray-500 truncate w-40">
                      {participant?.lastMessage?.message || "No messages yet"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </aside>

        {/* Chat Section */}
        <section
          className="flex-1 flex flex-col bg-base-100"
          style={{ height: "calc(100vh - 64px)" }}
        >
          {targetUserId ? (
            <>
              {/* Chat Header */}
              <div className="sticky top-0 flex items-center gap-3 p-4 bg-white border-b border-gray-300 z-10">
                <div className="w-10 h-10 rounded-full bg-accent text-accent-content flex items-center justify-center text-lg">
                  DP
                </div>
                <div>
                  <h2
                    className={`text-lg font-semibold ${
                      isGroupChat ? "cursor-pointer" : ""
                    }`}
                    onClick={
                      isGroupChat
                        ? (e) => groupMenuRef.current.openMenu(e)
                        : null
                    }
                  >
                    {isGroupChat ? groupName : name}
                  </h2>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={listRef}
                className="overflow-y-auto px-4 py-3 bg-gray-50"
                style={{ height: "80%" }}
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
                      isGroupChat={isGroupChat}
                    />
                  ))
                )}
              </div>

              {/* Input */}

              <div className="border-t border-gray-300 bg-white p-3 md:p-4 border-b">
                <div className="flex items-end gap-2 align-items-center">
                  <ImageKit handleSendMessage={handleSend} />
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
      <GroupChatDetails ref={groupMenuRef} isGroupChat={isGroupChat} />
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
