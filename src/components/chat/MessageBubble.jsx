import React from "react";

export default function MessageBubble({
  message,
  loggedInUserId,
  isGroupChat = false,
}) {
  const formatTime = (dateStamp) => {
    if (!dateStamp) return "";
    const date = new Date(dateStamp);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };
  const isOwnMessage = message.senderId === loggedInUserId;

  const bubbleBaseClasses =
    message.messageType === "text"
      ? "max-w-[75%] md:max-w-[60%] p-3 rounded-2xl text-sm"
      : "p-1";

  const bubbleColorClasses = isOwnMessage
    ? "bg-blue-600 text-white rounded-br-none"
    : "bg-gray-200 text-gray-800 rounded-bl-none";

  return (
    <div
      className={`flex mb-3 ${isOwnMessage ? "justify-end" : "justify-start"}`}
    >
      <div className={`${bubbleBaseClasses} ${bubbleColorClasses}`}>
        {/* Group chat sender label */}
        {isGroupChat && !isOwnMessage && (
          <span className="font-semibold text-red-600 block mb-1">
            {message.from}
          </span>
        )}

        {/* Message content */}
        {message.messageType === "image" ? (
          <img
            src={message.message}
            alt="image message"
            className="w-60 h-60 object-cover rounded-lg"
          />
        ) : (
          <p className="whitespace-pre-wrap break-words">{message.message}</p>
        )}

        {/* Timestamp */}
        <span className="font-semibold text-[8px] float-right mt-1 block">
          {formatTime(message.timeStamp)}
        </span>
      </div>
    </div>
  );
}
