import { useState, useCallback, useEffect } from "react";

const storageName = "userData";

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [uid, setUid] = useState(null);
  const [expires, setExpires] = useState(null);
  const [username, setUsername] = useState(null);
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const login = useCallback((jwtToken, id, timeToLive, name) => {
    setToken(jwtToken);
    setUid(id);
    setExpires(timeToLive);
    setUsername(name);
    setIsAuthenticated(true);

    localStorage.setItem(
      storageName,
      JSON.stringify({ uid: id, token: jwtToken, expires: timeToLive, name })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUid(null);
    setIsAuthenticated(false);
    setUsername(null);
    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));
    if (data && data.token && Date.now() - data.expires < 0) {
      login(data.token, data.uid, data.expires, data.name);
    }
    setReady(true);
  }, [login]);

  return {
    login,
    logout,
    token,
    uid,
    username,
    ready,
    expires,
    isAuthenticated,
  };
};
