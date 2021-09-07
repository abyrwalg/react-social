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

const Layout = (props) => {
  const { request } = useHttp();
  const { isAuthenticated, logout, token, changeUsername, changeAvatar } =
    useContext(AuthContext);

  const history = useHistory();
  const [navExpanded, setNavExpanded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await request('/api/user/', 'GET', null, {
          Authorization: `Bearer ${token}`,
        });

        changeUsername(response.data.name);
        changeAvatar(response.data.avatar);
      } catch (error) {
        console.log(error);
      }
    }
    if (token) {
      fetchData();
    }
  }, [request, token, changeAvatar, changeUsername]);

  const loginButton = (
    <Nav.Link
      className="logout-button"
      as={Link}
      to="/login"
      onClick={() => setNavExpanded(false)}
    >
      Войти
    </Nav.Link>
  );

  const userMenu = (
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
          logout();
          history.go('/');
        }}
      >
        Выйти
      </NavDropdown.Item>
    </NavDropdown>
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
          <Navbar.Brand as={Link} to="/" onClick={() => setNavExpanded(false)}>
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
            {isAuthenticated ? userMenu : loginButton}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container style={{ marginTop: '75px' }}>{props.children}</Container>
    </>
  );
};

export default Layout;
