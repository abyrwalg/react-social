import { createContext } from 'react';

function noop() {}

export const UserMenuContext = createContext({
  userMenuData: {},
  setUserMenuData: noop,
});
