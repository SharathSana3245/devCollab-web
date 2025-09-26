import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequests } from "../utils/requestSlice";
import axios from "axios";
import { BASE_URL } from "../constants";
import RequestCard from "./RequestCard";
import { useToast } from "../common/Toast";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);

  const showToastAction = (status) => {
    showToast(status, "success");
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/recieved`, {
        withCredentials: true,
      });
      setLoading(false);
      dispatch(addRequests(res?.data?.data || []));
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-6 flex flex-col justify-center items-center max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Requests</h2>
      {loading && <span className="loading loading-ring loading-xl"></span>}
      {requests?.length === 0 && !loading && (
        <p className="text-gray-500">No pending requests.</p>
      )}

      <div className="flex flex-col gap-4">
        {requests?.map((user, idx) => (
          <RequestCard
            key={user._id || idx}
            user={user}
            onRequestAction={fetchRequests}
            setToast={showToastAction}
          />
        ))}
      </div>
    </div>
  );
};

export default Requests;
