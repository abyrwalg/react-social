import { useState, useCallback, useEffect } from "react";

const storageName = "userData";

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [uid, setUid] = useState(null);
  const [id, setId] = useState(null);
  const [expires, setExpires] = useState(null);
  const [username, setUsername] = useState(null);
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const login = useCallback((jwtToken, id, uid, timeToLive, name) => {
    setToken(jwtToken);
    setUid(uid);
    setId(id);
    setExpires(timeToLive);
    setUsername(name);
    setIsAuthenticated(true);

    localStorage.setItem(
      storageName,
      JSON.stringify({ uid, id, token: jwtToken, expires: timeToLive, name })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUid(null);
    setId(null);
    setIsAuthenticated(false);
    setUsername(null);
    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));
    if (data && data.token && Date.now() - data.expires < 0) {
      login(data.token, data.id, data.uid, data.expires, data.name);
    }
    setReady(true);
  }, [login]);

  return {
    login,
    logout,
    token,
    id,
    uid,
    username,
    ready,
    expires,
    isAuthenticated,
  };
};
