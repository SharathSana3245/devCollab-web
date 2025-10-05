import { Link } from "react-router-dom";
import { BASE_PHOTO_URL } from "../constants";

const ConnectionCard = ({ user }) => {
  const { firstName, lastName, photoUrl, about, age, gender, _id } = user;

  return (
    <div className="flex items-center justify-between gap-4 border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
      <div className="flex items-center gap-4">
        <img
          src={photoUrl || BASE_PHOTO_URL}
          alt={`${firstName} ${lastName}`}
          className="w-16 h-16 rounded-full object-cover border"
        />
        <div className="flex flex-col">
          <p className="text-lg font-medium text-gray-800">
            {firstName} {lastName}
          </p>
          <span>
            {age || ""}
            {gender || ""}
          </span>
          <span className="text-sm text-gray-600 line-clamp-2">{about}</span>
        </div>
      </div>
      <Link to={`/chat/${_id}`} state={{ name: `${firstName} ${lastName}` }}>
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
          Chat
        </button>
      </Link>
    </div>
  );
};

export default ConnectionCard;
