const AUTH_STORAGE_KEY = 'userData';
const ACCESS_TOKEN_DATA_REGEXP = /^[^.]+\.([^\s]+)[^.]*$/i;

export const getAuthData = () =>
  JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || '{}');

export const hasAuthData = () => !!getAuthData().id;

export const saveAuthData = ({ uid, id, name, token, refreshToken }) =>
  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({ uid, id, name, token, refreshToken })
  );

export const clearAuthData = () => localStorage.removeItem(AUTH_STORAGE_KEY);

/**
 * Get data saved in token (userId, role..)
 * @returns {object|null}
 */
export const getTokenData = () => {
  const { accessToken } = getAuthData();

  if (!accessToken || !ACCESS_TOKEN_DATA_REGEXP.test(accessToken)) {
    return null;
  }

  return JSON.parse(window.atob(accessToken.split('.')[1]));
};
