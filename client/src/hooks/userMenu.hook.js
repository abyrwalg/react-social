import { useState, useCallback } from "react";

export const useUserMenu = () => {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  const changeUsername = useCallback((newUsername) => {
    setUsername(newUsername);
  }, []);
  const changeAvatar = useCallback((newAvatar) => {
    setAvatar(newAvatar);
  }, []);

  return { username, changeUsername, avatar, changeAvatar };
};
