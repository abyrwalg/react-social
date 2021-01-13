import { createContext } from "react";

function noop() {}

export const AuthContext = createContext({
  token: null,
  uid: null,
  expires: null,
  login: noop,
  logout: noop,
  isAuthenticated: false,
  username: null,
  avatar: null,
  changeUsername: noop,
  changeAvatar: noop,
});
