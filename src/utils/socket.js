import socketIOClient from "socket.io-client";
import { BASE_URL } from "../constants";

export const createSocketConnection = () => {
    console.log("Creating socket connection to ", BASE_URL);
  return socketIOClient(BASE_URL);
}