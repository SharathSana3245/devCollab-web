import "./App.css";
import Body from "./components/Body";
import Login from "./components/Login";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./components/SignUp";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import { ToastProvider } from "./common/Toast";
import ChatWindow from "./components/ChatWindow";

function App() {
  return (
    <>
      <ToastProvider>
        <Provider store={appStore}>
          <BrowserRouter basename="/">
            <Routes>
              <Route path="/" element={<Body />}>
                <Route path="/" element={<Feed />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/connections" element={<Connections />} />
                <Route path="/requests" element={<Requests />} />
                <Route path="/chat/:targetUserId" state={{ isGroupChat: false }} element={<ChatWindow />} />
                <Route path="/messages" element={<ChatWindow />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </Provider>
      </ToastProvider>
    </>
  );
}

export default App;
