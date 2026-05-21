import axios from "axios";

const api = axios.create({
  baseURL: "https://smartschool-erp.onrender.com",
});

api.interceptors.request.use(
  (config) => {
    const userToken = localStorage.getItem("jwtToken");

    const token = userToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
