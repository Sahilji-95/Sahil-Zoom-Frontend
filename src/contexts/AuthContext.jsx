import axios from "axios";
import { useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import httpStatus from "http-status";
import server from "../envoirment";

export const AuthContext = createContext({});

const client = axios.create({
  baseURL: `${server}/api/v1/user`,
});

export const AuthProvider = ({ children }) => {
  //   const authContext = useContext(AuthContext);
  const router = useNavigate();

  const [userData, setUserData] = useState(null);

  const handleRegister = async (name, username, password, email) => {
    try {
      let request = await client.post("/register", {
        name: name,
        username: username,
        password: password,
        email: email,
      });
      if (request.status === httpStatus.CREATED) {
        return request.data.message;
      }
    } catch (err) {
      throw err;
    }
  };

  const handleLogin = async (username, password) => {
    try {
      let request = await client.post("/login", {
        username: username,
        password: password,
      });
      if (request.status === httpStatus.OK) {
        localStorage.setItem("token", request.data.token);
        router("/home");
      }
    } catch (err) {
      throw err;
    }
  };

  const getUserHistory = async () => {
    try {
      let request = await client.get("/get_all_activity", {
        params: {
          token: localStorage.getItem("token"),
        },
      });
      return request.data;
    } catch (error) {
      throw error;
    }
  };

  const addToUserHistory = async (meetingCode) => {
    try {
      let request = await client.post("/add_to_activity", {
        token: localStorage.getItem("token"),
        meeting_code: meetingCode,
      });
      return request;
    } catch (error) {
      throw error;
    }
  };

  const data = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
    getUserHistory,
    addToUserHistory,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
