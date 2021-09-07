import React, { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Switch, Route, Redirect } from 'react-router-dom';

import PrivateRoute from './containers/PrivateRoute';

import Layout from './components/UI/Layout/Layout';
import UserPage from './components/UserPage/UserPage';
import LoginPage from './components/LoginPage/LoginPage';
import SignUpPage from './components/SignUpPage/SignUpPage';

import { AuthContext } from './context/AuthContext';
// import { useAuth } from './hooks/auth.hook';
import { useUserMenu } from './hooks/userMenu.hook';
import { EditUserDataPage } from './components/EditUserDataPage/EditUserDataPage';
import { hasAuthData } from './helpers/authStorage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(hasAuthData());
  // const { token, login, logout, id, uid, expires, ready } = useAuth();
  const { avatar, username, changeAvatar, changeUsername } = useUserMenu();
  // const isAuthenticated = new Date() < new Date(expires);

  return (
    <AuthContext.Provider
      value={{
        // token,
        // login,
        // logout,
        // id,
        // uid,
        username,
        // isAuthenticated,
        // expires,
        isLoggedIn,
        setIsLoggedIn,
        avatar,
        changeAvatar,
        changeUsername,
      }}
    >
      <Layout>
        <Switch>
          <Route path="/users/:id" component={UserPage} />
          <Route path="/login" exact component={LoginPage} />
          <Route path="/signup" exact component={SignUpPage} />
          <PrivateRoute path="/edit" exact component={EditUserDataPage} />
          <Redirect to="users/1" />
        </Switch>
      </Layout>
    </AuthContext.Provider>
  );
}

export default App;
