import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants";

const Login = () => {
  const dispatch = useDispatch();
  const [creds, setCreds] = useState({ emailId: "", password: "Sana@3245" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/login`, creds, {
        withCredentials: true,
      });
      dispatch(addUser(res.data.user));
      if (res.status === 200) {
        return navigate("/");
      }
    } catch (err) {
      setError(err.response?.data || "Something went wrong!!.");
      console.error(err);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="card w-96 bg-base-200 card-xs shadow-sm">
        <div className="card-body">
          <h2 className="card-title flex justify-center text-bold">Login</h2>

          <fieldset className="fieldset">
            <legend className="fieldset-legend ">Gmail</legend>
            <input
              type="text"
              className="input w-full"
              value={creds.emailId}
              onChange={(e) => {
                setCreds({ ...creds, emailId: e.target.value });
              }}
              placeholder="Please enter your Gmail"
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Password</legend>
            <input
              type="password"
              className="input w-full"
              value={creds.password}
              onChange={(e) => {
                setCreds({ ...creds, password: e.target.value });
              }}
            />
          </fieldset>

          <p className="text-red-500">{error}</p>
          <div className="justify-center card-actions">
            <button className="btn btn-primary" onClick={handleLogin}>
              Login
            </button>
          </div>
          <p
            className="btn text-xl-bold border-none"
            onClick={() => {
              navigate("/signup");
            }}
          >
            New User? Create an accout here !!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
