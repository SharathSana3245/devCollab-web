import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { addUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../constants";

const EditProfile = ({ user }) => {
  const [userData, setUserData] = useState(user);
  console.log(userData, "userData");
  const [showToast, setShowToast] = useState(false);

  const dispatch = useDispatch();
  const handleUpdateProfile = async () => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/profile/edit`,
        {
          photoUrl: userData.photoUrl,
          skills: userData.skils,
          firstName: userData.firstName,
          lastName: userData.lastName,
          about: userData.about,
          gender: user.gender,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(addUser(res.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
      console.log(res.data, "updated user data");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="flex justify-center items-center gap-10 mt-10">
      <div className="flex justify-center items-center h-screen">
        <div className="card w-96 bg-base-200 card-xs shadow-sm">
          <div className="card-body">
            <h2 className="card-title flex justify-center text-bold">Edit</h2>

            <fieldset className="fieldset">
              <legend className="fieldset-legend ">firstName</legend>
              <input
                type="text"
                className="input w-full"
                value={userData.firstName}
                onChange={(e) => {
                  setUserData({ ...userData, firstName: e.target.value });
                }}
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">lastName</legend>
              <input
                type="text"
                className="input w-full"
                value={userData.lastName}
                onChange={(e) => {
                  setUserData({ ...userData, lastName: e.target.value });
                }}
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">about</legend>
              <input
                type="text"
                className="input w-full"
                value={userData.about}
                onChange={(e) => {
                  setUserData({ ...userData, about: e.target.value });
                }}
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">photoUrl</legend>
              <input
                type="text"
                className="input w-full"
                value={userData.photoUrl}
                onChange={(e) => {
                  setUserData({ ...userData, photoUrl: e.target.value });
                }}
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">age</legend>
              <input
                type="text"
                className="input w-full"
                value={userData.age}
                onChange={(e) => {
                  setUserData({ ...userData, age: e.target.value });
                }}
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">gender</legend>
              <input
                type="text"
                className="input w-full"
                value={userData.gender}
                onChange={(e) => {
                  setUserData({ ...user, gender: e.target.value });
                }}
              />
            </fieldset>
            <div className="justify-center card-actions">
              <button className="btn btn-primary" onClick={handleUpdateProfile}>
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      <UserCard user={userData} showAction={false} />
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-info">
            <span>Profile Updated Successfully</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
