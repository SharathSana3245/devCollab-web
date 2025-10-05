import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants";

const SignUp = () => {
  const details = { firstName: "", lastName: "", emailId: "", password: "" };
  const [creds, setCreds] = useState(details);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState({ message: "", show: false });
  const navigate = useNavigate();
  const handleSignUP = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/signup`, creds, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setShowToast({
          message: "SignUp Successful!! Redirecting to Login...",
          show: true,
        });
        setTimeout(() => {
          setShowToast({ message: "", show: false });
        }, 3000);
        navigate("/login");
        setCreds(details);
      }
    } catch (err) {
      setError(err.response?.data || "Something went wrong!!.");
      console.error(err);
    }
  };
  
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="card w-96 bg-base-300 card-xs shadow-sm">
        <div className="card-body">
          <h2 className="card-title flex justify-center text-bold">SignUp</h2>
          <fieldset className="fieldset">
            <legend className="fieldset-legend ">FirstName</legend>
            <input
              type="text"
              className="input w-full"
              value={creds.firstName}
              onChange={(e) => {
                setCreds({ ...creds, firstName: e.target.value });
              }}
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend ">LastName</legend>
            <input
              type="text"
              className="input w-full"
              value={creds.lastName}
              onChange={(e) => {
                setCreds({ ...creds, lastName: e.target.value });
              }}
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend ">Email</legend>
            <input
              type="text"
              className="input w-full"
              value={creds.emailId}
              onChange={(e) => {
                setCreds({ ...creds, emailId: e.target.value });
              }}
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
            <button className="btn btn-primary" onClick={handleSignUP}>
              SignUp
            </button>
          </div>
        </div>
      </div>
      {showToast?.show && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-info">
            <span>{showToast?.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
