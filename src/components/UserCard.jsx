import axios from "axios";
import { BASE_PHOTO_URL, BASE_URL } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useToast } from "../common/Toast";
import { useState } from "react";

const UserCard = ({ user, showAction = true }) => {
  const { firstName, lastName, about, photoUrl, age, gender } = user;
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const [loading, setLoading] = useState(false);

  const handleConnectionRequest = async (status) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/request/send/${status}/${user._id}`,
        {},
        {
          withCredentials: true,
        }
      );
      setLoading(false);
      if (res) {
        showToast(`Sent request successfully!`, "success");
        const newFeed = feed?.filter((u) => u._id !== user._id);
        dispatch(addFeed(newFeed));
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="card bg-base-300 w-96 shadow-sm">
      <figure>
        <img src={photoUrl || BASE_PHOTO_URL} alt="Shoes" className="w-full" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {firstName} {lastName}
        </h2>
        <span>
          {age || ""} {gender || ""}
        </span>
        <p>{about}</p>
        {showAction ? (
          <div className="card-actions justify-end">
            <div
              className="btn btn-secondary"
              onClick={() => {
                handleConnectionRequest("interested");
              }}
            >
              {loading ? (
                <span className="loading loading-dots loading-lg"></span>
              ) : (
                "interested"
              )}
            </div>
            <div
              className="btn btn-primary"
              onClick={() => {
                handleConnectionRequest("ignored");
              }}
            >
              Ignored
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default UserCard;
