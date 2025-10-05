import axios from "axios";
import React from "react";
import { BASE_PHOTO_URL, BASE_URL } from "../constants";

const RequestCard = ({ user, onRequestAction, setToast }) => {
  const { firstName, lastName, about, photoUrl, gender, age } =
    user.fromUserId || {};
  const { createdAt } = user || {};

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const handleReviewConnection = async (status) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/request/review/${status}/${user._id}`,
        {},
        {
          withCredentials: true,
        }
      );
      res && onRequestAction();

      setToast(`Request ${status} successfully`);
    } catch (err) {
      console.error("Error reviewing connection:", err);
    }
  };
  return (
    <div className="card bg-base-100 shadow-md w-full max-w-lg hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center gap-6 p-6">
        {/* Profile Image */}
        <img
          src={photoUrl || BASE_PHOTO_URL}
          alt={`${firstName} ${lastName}`}
          className="w-24 h-24 rounded-full object-cover border"
        />

        {/* Card Content */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold">
            {firstName} {lastName}
          </h2>
          <span>{`${gender || ""} ${age || ""}`}</span>
          <p className="text-sm text-gray-600">{about}</p>

          {/* Actions */}
          <div className="mt-4 flex gap-3">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                handleReviewConnection("accepted");
              }}
            >
              Accept
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                handleReviewConnection("rejected");
              }}
            >
              Deny
            </button>
          </div>

          {/* Request Time */}
          {formattedDate && (
            <p className="mt-3 text-xs text-gray-500">
              Requested on {formattedDate}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
