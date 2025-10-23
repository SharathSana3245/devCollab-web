import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants";
import Timer from "./Timer";

const SignUp = () => {
  const details = {
    firstName: "Sharath",
    lastName: "kumar",
    emailId: "collablearning532201@gmail.com",
    password: "Sana@3245",
  };
  const [creds, setCreds] = useState(details);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState({ message: "", show: false });
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const handleSignUP = async () => {
    try {
      setLoader(true);
      const res = await axios.post(`${BASE_URL}/signup`, creds, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setLoader(false);
        setShowToast({
          message: "OTP sent to your email.",
          show: true,
        });
        setTimeout(() => setShowToast({ message: "", show: false }), 3000);
        setShowOtpForm(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong!!");
      console.error(err);
      setLoader(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoader(true);
      const res = await axios.post(`${BASE_URL}/verifyOtp`, {
        emailId: creds.emailId,
        otp,
      });

      if (res.status === 200) {
        setShowToast({
          message: "OTP Verified! Redirecting to Login...",
          show: true,
        });
        setLoader(false);
        setTimeout(() => {
          setShowToast({ message: "", show: false });
          navigate("/login");
          setCreds(details);
          setOtp("");
          setShowOtpForm(false);
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.error || "OTP verification failed!");
      console.error(err);
      setLoader(false);
    }
  };

  const hanldeTimer = () => {
    setShowOtpForm(false);
  };

  useEffect(() => {
    return () => {
      setError(null);
    };
  }, [showOtpForm]);
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-lg">
        <div className="card-body">
          {!showOtpForm ? (
            <>
              <h2 className="card-title justify-center text-xl font-bold mb-4">
                {loader ? `Sending OTP to ${creds.emailId}...` : "Create an Account"}
              </h2>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">First Name</legend>
                <input
                  type="text"
                  className="input w-full"
                  value={creds.firstName}
                  onChange={(e) =>
                    setCreds({ ...creds, firstName: e.target.value })
                  }
                  required
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Last Name</legend>
                <input
                  type="text"
                  className="input w-full"
                  value={creds.lastName}
                  onChange={(e) =>
                    setCreds({ ...creds, lastName: e.target.value })
                  }
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Gmail</legend>
                <input
                  type="email"
                  className="input w-full"
                  value={creds.emailId}
                  onChange={(e) =>
                    setCreds({ ...creds, emailId: e.target.value })
                  }
                  placeholder="Please enter your Gmail"
                  required
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Password</legend>
                <input
                  type="password"
                  className="input w-full"
                  value={creds.password}
                  onChange={(e) =>
                    setCreds({ ...creds, password: e.target.value })
                  }
                  required
                />
              </fieldset>

              {error && <p className="text-red-500 mt-2">{error}</p>}

              <div className="justify-center card-actions mt-4">
                <button
                  className="btn btn-primary w-full"
                  onClick={handleSignUP}
                  disabled={loader}
                >
                  {loader ? "Signing Up..." : "Sign Up"}
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="card-title justify-center text-xl font-bold mb-4">
                Verify OTP
              </h2>
              <p className="mb-2">
                Enter the OTP sent to <b>{creds.emailId}</b>
              </p>
              <input
                type="number"
                className="input w-full mb-4"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ oberflow: "hidden", textOverflow: "ellipsis" }}
              />
              {error && <p className="text-red-500 mb-2">{error}</p>}
              <div className="justify-center card-actions">
                <button
                  className="btn btn-primary w-full"
                  onClick={handleVerifyOtp}
                  disabled={loader}
                >
                  {loader ? "Verifying..." : "Verify OTP"}
                </button>
                <Timer counter={60} trigger={hanldeTimer} />
              </div>
            </>
          )}
        </div>
      </div>
      {showToast?.show && (
        <div className="toast toast-top toast-center" style={{ zIndex: 9999 }}>
          <div className="alert alert-info">
            <span>{showToast?.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
