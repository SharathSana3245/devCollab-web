import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addConnections } from "../../utils/connectionsSlice";
import { BASE_URL } from "../../constants";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Toast from "../Toast";
import { showToast } from "../../utils/notificationSlice";

export const CreateGroupChat = ({ setGroupChat }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [nextStep, setNextStep] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [groupName, setGroupName] = useState("");

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
          groupName: groupName || "Unnamed Group",
        },
        {
          withCredentials: true,
        }
      );
      setGroupChat(false);
      console.log(res?.data, "group chat created");
      dispatch(showToast({ message: "Group Created Successfully!" }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const leaveCreateGroupChat = () => {
    setGroupChat(false);
  };
  return (
    <div>
      {connections?.length === 0 && <div>No connections found.</div>}
      {selectedUsers.length > 1 && !nextStep && (
        <div className="flex items-center justify-between gap-2">
          <button
            className="p-2  color-primary cursor-pointer"
            onClick={() => {
              setNextStep(!nextStep);
            }}
          >
            Next
          </button>
          <button className="p-2  color-secondary cursor-pointer">
            Cancel
          </button>
        </div>
      )}
      <div>
        {!nextStep ? (
          connections?.map((connection) => (
            <div
              key={connection._id}
              className="mb-2 p-2 border rounded flex items-center gap-2"
            >
              <input
                type="checkbox"
                checked={selectedUsers.includes(connection?._id)}
                onChange={() => toggleSelectedUsers(connection?._id)}
                className="checkbox"
              />

              <p className="font-medium">{`${connection?.firstName}`}</p>
            </div>
          ))
        ) : (
          <div className="text-center space-y-4">
            <input
              placeholder="Group Name(optional)"
              className="input"
              onChange={(e) => {
                setGroupName(e.target.value);
              }}
            />
            <div className="flex justify-between">
              <Button variant="contained" onClick={handleCreateGroupChat}>
                Create
              </Button>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Cancel creating group chat?
          </Typography>
          <Button variant="contained" onClick={leaveCreateGroupChat}>
            Yes,Cancel
          </Button>
          <Button variant="outlined" onClick={handleModalClose}>
            Go,Back
          </Button>
        </Box>
      </Modal>
    </div>
  );
};
