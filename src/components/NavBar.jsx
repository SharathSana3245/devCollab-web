import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_PHOTO_URL, BASE_URL } from "../constants";
import { removeUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeConnections } from "../utils/connectionsSlice";
import { removeRequests } from "../utils/requestSlice";
import { removeFeed } from "../utils/feedSlice";

const NavBar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      dispatch(removeUser());
      dispatch(removeConnections());
      dispatch(removeRequests());
      dispatch(removeFeed())
      return navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="navbar bg-neutral-300 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" onClick={()=>{navigate("/")}}>DevCollab</a>
      </div>
      {user && <p className="mr-2 text-xl-bold">{`Welcome,${user.firstName}`}</p>}
      {user && (
        <div className="flex gap-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component" src={user.photoUrl || BASE_PHOTO_URL} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a
                  className="justify-between"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </a>
              </li>
              <li onClick={() => navigate("/requests")}>
                <a>Requests</a>
              </li>
              <li onClick={() => navigate("/connections")}>
                <a>Connections</a>
              </li>
              <li onClick={handleLogout}>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
