import axios from "axios";


const API = axios.create({ baseURL: "http://localhost:5000/auth" });

export const login = async (email, password) => {
  const response = await API.post("/login", { email, password });
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await API.post("/register", { username, email, password });
  return response.data;
};
