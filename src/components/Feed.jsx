import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useDispatch } from "react-redux";
import UserCard from "./UserCard";
import { BASE_URL } from "../constants";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const [loading, setLoading] = useState(true);
  const fetchFeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(`${BASE_URL}/user/feed`, {
        withCredentials: true,
      });
      setLoading(false);
      dispatch(addFeed(res.data?.data || []));
      console.log(res.data, "feed data");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center mt-10">
      {loading ? (
        <span className="loading loading-ring loading-xl">
          Fetching your feed
        </span>
      ) : feed && feed.length > 0 ? (
        <div className="flex flex-col gap-4">
          {feed.map((user) => (
            <UserCard key={user._id} user={user}/>
          ))}
        </div>
      ) : (
        <h2 className="text-2xl font-semibold mb-6">No more Feed to show</h2>
      )}
    </div>
  );
};

export default Feed;
