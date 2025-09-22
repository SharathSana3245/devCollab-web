import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetchUser = async () => {
    try {
      const user = await axios.get(`${BASE_URL}/profile/view`, {
        withCredentials: true,
      });
      return dispatch(addUser(user.data));
    } catch (err) {
     if(err.status === 401 || err.status === 400){
        return navigate("/login");
     }
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
