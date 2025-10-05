import React from "react";
import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";

const Profile = () => {
  const user = useSelector((state) => state.user);

  return (
    <>
      {user ? (
        <div className="flex flex-col justify-center items-center m-10 mt-0">
          <EditProfile user={user} />
        </div>
      ) : null}
    </>
  );
};

export default Profile;
