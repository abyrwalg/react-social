import { useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import { Switch, Route, Redirect } from "react-router-dom";

import Layout from "./components/UI/Layout/Layout";
import UserPage from "./components/UserPage/UserPage";
import LoginPage from "./components/LoginPage/LoginPage";
import SignUpPage from "./components/SignUpPage/SignUpPage";

import { AuthContext } from "./context/AuthContext";
import { useAuth } from "./hooks/auth.hook";
import { useUserMenu } from "./hooks/userMenu.hook";
import { EditUserDataPage } from "./components/EditUserDataPage/EditUserDataPage";

function App() {
  const { token, login, logout, uid, expires, ready } = useAuth();
  const { avatar, username, changeAvatar, changeUsername } = useUserMenu();
  const isAuthenticated = new Date() < new Date(expires);

  /* useEffect(() => {
    document.body.style.backgroundColor = "#edeef0";
  }, []); */

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        uid,
        username,
        isAuthenticated,
        expires,
        avatar,
        changeAvatar,
        changeUsername,
      }}
    >
      <Layout>
        <Switch>
          <Route path="/users/:id" component={UserPage} />
          {!isAuthenticated ? (
            <Route path="/login" exact component={LoginPage} />
          ) : null}
          <Route path="/signup" exact component={SignUpPage} />
          {isAuthenticated ? (
            <Route path="/edit" exact component={EditUserDataPage} />
          ) : null}
          {ready ? <Redirect to={`/users/${uid ? uid : "1"}`} /> : null}
        </Switch>
      </Layout>
    </AuthContext.Provider>
  );
}

export default App;
