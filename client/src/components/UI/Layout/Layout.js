/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState, useContext } from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Link, useHistory } from 'react-router-dom';

import AvatarDropdownToggle from './AvatarDropdownToggle/AvatarDropdownToggle';

import './Layout.css';
import { AuthContext } from '../../../context/AuthContext';

import { useHttp } from '../../../hooks/http.hook';
import {
  clearAuthData,
  getAuthData,
  hasAuthData,
} from '../../../helpers/authStorage';

const Layout = (props) => {
  const { request } = useHttp();
  const { changeUsername, changeAvatar, isLoggedIn, setIsLoggedIn } =
    useContext(AuthContext);

  const history = useHistory();
  const [navExpanded, setNavExpanded] = useState(false);

  useEffect(() => {
    console.log('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await request('/api/user/', 'GET');

        changeUsername(response.data.name);
        changeAvatar(response.data.avatar);
      } catch (error) {
        console.log(error);
      }
    }
    if (isLoggedIn) {
      fetchData();
    }
  }, [request, changeAvatar, changeUsername, isLoggedIn]);

  const loginMenu = isLoggedIn ? (
    <NavDropdown title={<AvatarDropdownToggle />} id="basic-nav-dropdown">
      <NavDropdown.Item
        as={Link}
        to="/edit"
        onClick={() => setNavExpanded(false)}
      >
        Редактировать
      </NavDropdown.Item>
      <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
      <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item
        onClick={() => {
          clearAuthData();
          setIsLoggedIn(false);
          history.push('/');
        }}
      >
        Выйти
      </NavDropdown.Item>
    </NavDropdown>
  ) : (
    <Nav.Link
      className="logout-button"
      as={Link}
      to="/login"
      onClick={() => setNavExpanded(false)}
    >
      Войти
    </Nav.Link>
  );
  return (
    <>
      <Navbar
        bg="dark"
        expand="lg"
        variant="dark"
        fixed="top"
        collapseOnSelect
        className="main-navigation-bar"
        expanded={navExpanded}
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to={`/users/${hasAuthData() ? getAuthData().uid : 1}`}
            onClick={() => setNavExpanded(false)}
          >
            Social-Network
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setNavExpanded(navExpanded ? false : 'expanded')}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link
                as={Link}
                to="/users/1"
                onClick={() => setNavExpanded(false)}
              >
                Пользователь
              </Nav.Link>
              <Nav.Link href="#" onClick={() => setNavExpanded(false)}>
                Тест
              </Nav.Link>
            </Nav>
            <Form inline className="mr-auto">
              <FormControl
                type="text"
                placeholder="Search"
                className="mr-sm-2"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
            {loginMenu}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container style={{ marginTop: '75px' }}>{props.children}</Container>
    </>
  );
};

export default Layout;
