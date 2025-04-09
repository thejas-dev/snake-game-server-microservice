import axios from "axios";
import { HOST } from "./ApiRoutes";

const axiosInstance = axios.create({
  baseURL: HOST,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
        const tokens = JSON.parse(sessionStorage.getItem('userTokens'));
        if (tokens) {
            config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (Optional: Handle 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized! Redirecting to login...");
      
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
