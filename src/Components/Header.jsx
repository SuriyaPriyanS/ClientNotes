import React, { memo } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { PersonCircle } from 'react-bootstrap-icons';
import '../Styles/Header.css';

const Header = memo(() => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          📝 NotesApp
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/notes">My Notes</Nav.Link> */}
          </Nav>

          <Nav>
              <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/notes">My Notes</Nav.Link>
            <NavDropdown title={<PersonCircle size={24} />} id="profile-dropdown" align="end">
              {isLoggedIn ? (
                <>

                  <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/dashboard">DashBoard</NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </>
              ) : (
                <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});

Header.displayName = 'Header';

export default Header;
