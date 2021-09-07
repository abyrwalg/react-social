import axios from 'axios';

import {
  getAuthData,
  saveAuthData,
  // clearAuthData,
} from '../helpers/authStorage';

axios.interceptors.request.use(
  (config) => {
    const customConfig = { ...config };
    const { token } = getAuthData();
    if (token) {
      customConfig.headers.Authorization = `Bearer ${token}`;
    }
    // config.headers['Content-Type'] = 'application/json';
    return customConfig;
  },
  (error) => {
    Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { refreshToken, id } = JSON.parse(localStorage.getItem('userData'));
      if (!refreshToken) {
        return Promise.reject(error);
      }

      return fetch(`/api/auth/token-refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken,
          userId: id,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.token) {
            saveAuthData({
              uid: res.uid,
              id: res.id,
              token: res.token,
              expires: res.timeToLive,
              name: res.name,
              refreshToken: res.refreshToken,
            });
            axios.defaults.headers.common.Authorization = `Bearer ${res.token}`;
            return axios(originalRequest);
          }
          return Promise.reject(res);
        })
        .catch((refreshTokenResponse) => {
          // clearAuthData();
          // document.location.href = '/login';
          return Promise.reject(refreshTokenResponse);
        });
    }
    return Promise.reject(error);
  }
);
