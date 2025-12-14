import axios from "axios";
import {
  getRefreshToken,
  getToken,
  removeRefreshToken,
  removeToken,
  setRefreshToken,
  setToken,
} from "./utility/authService";
import { startGlobalLoading, stopGlobalLoading } from "./utility/loadingBus";

export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const apiService = axios.create({
  baseURL: BASE_URL,
  // withCredentials: true, (only needed for cookies)
});

// Request Interceptor
let requestCount = 0;

apiService.interceptors.request.use(
  (config) => {
    requestCount++;
    startGlobalLoading();
    const token = getToken();

    if (token && !config.url?.includes("/auth/refresh")) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  async (response) => {
    requestCount--;
    if (requestCount === 0) stopGlobalLoading();

    return response;
  },
  async (error) => {
    requestCount--;
    if (requestCount === 0) stopGlobalLoading();
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Inside response interceptor
        const res = await apiService.post(`/api/auth/refresh`, {
          refreshToken: getRefreshToken(),
        });

        const { accessToken, refreshToken } = res.data.data;
        setToken(accessToken);
        setRefreshToken(refreshToken);
        return apiService(originalRequest);
      } catch (refreshError) {
        removeToken();
        removeRefreshToken();
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
