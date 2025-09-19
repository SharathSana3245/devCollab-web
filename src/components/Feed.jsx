import axios from "axios";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useDispatch } from "react-redux";
import UserCard from "./UserCard";
import { BASE_URL } from "../constants";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const fetchFeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(`${BASE_URL}/user/feed`, {
        withCredentials: true,
      });
      dispatch(addFeed(res.data?.data || []));
      console.log(res.data, "feed data");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);
  return feed ? (
    <div className="flex flex-col justify-center items-center mt-10">
      {feed?.length === 0 ? (
        <h2 className="text-2xl font-semibold mb-6">No more Feed to show</h2>
      ) : (
        <div className="flex flex-col gap-4">
          {feed?.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      )}
    </div>
  ) : null;
};

export default Feed;
