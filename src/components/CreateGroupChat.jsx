import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addConnections } from "../utils/connectionsSlice";
import { BASE_URL } from "../constants";
import axios from "axios";

export const CreateGroupChat = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const fetchAllConnections = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      // setLoading(false);
      dispatch(addConnections(res?.data?.data));
      console.log(res?.data?.data, "all connections");
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const toggleSelectedUsers = (userId) => {
    const check = selectedUsers.includes(userId);
    if (check) {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
      return;
    } else {
      setSelectedUsers((prev) => [...prev, userId]);
    }
  };

  useEffect(() => {
    fetchAllConnections();
  }, []);

  const handleCreateGroupChat = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/chat/createGroup`,
        {
          participantIds: selectedUsers,
          groupName: "New Group Chat",
        },
        {
          withCredentials: true,
        }
      );
      console.log(res?.data, "group chat created");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {connections?.length === 0 && <div>No connections found.</div>}
      {selectedUsers.length > 1 && (
        <div className="flex items-center justify-between gap-2">
          <button
            className="p-2  color-primary cursor-pointer"
            onClick={handleCreateGroupChat}
          >
            Next
          </button>
          <button className="p-2  color-secondary cursor-pointer">
            Cancel
          </button>
        </div>
      )}
      <div>
        {connections?.map((connection) => (
          <div
            key={connection._id}
            className="mb-2 p-2 border rounded flex items-center gap-2"
          >
            <input
              type="checkbox"
              checked={selectedUsers.includes(connection._id)}
              onChange={() => toggleSelectedUsers(connection._id)}
              className="checkbox"
            />

            <p className="font-medium">{`${connection.firstName}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
