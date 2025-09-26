import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionsSlice";
import ConnectionCard from "./ConnectionCard";
import { BASE_URL } from "../constants";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const [loading, setLoading] = useState(true);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      setLoading(false);
      dispatch(addConnections(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col justify-center items-center">
      {/* Heading */}
      <h2 className="text-2xl font-semibold mb-6">Connections</h2>

      {connections?.length === 0 && !loading && (
        <p className="text-gray-600">No connections found.</p>
      )}
      <div>
        {loading && <span className="loading loading-ring loading-xl"></span>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections?.map((connection) => (
          <ConnectionCard key={connection._id} user={connection} />
        ))}
      </div>
    </div>
  );
};

export default Connections;
