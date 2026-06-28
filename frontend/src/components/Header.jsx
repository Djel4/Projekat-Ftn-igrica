import React from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap'
import { FaUser, FaSignOutAlt } from 'react-icons/fa'
import logo from '../assets/game.png'
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const navigate = useNavigate();
    const playerId = localStorage.getItem('playerId');
    const playerName = localStorage.getItem('playerName');

    const handleLogout = () => {
        localStorage.removeItem('playerId');
        localStorage.removeItem('playerName');
        navigate('/');
    };

    return (
        <header>
            <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>
                            <img src={logo} alt="Blasting waves" width="30" height="30" className="d-inline-block me-2" />
                            <span className="fw-bold">Blasting Waves</span>
                            Creation by Djel4
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className='ms-auto'>
                            {playerId ? (
                                <>
                                    <Nav.Link disabled>
                                        <FaUser /> {playerName}
                                    </Nav.Link>
                                    <Nav.Link onClick={handleLogout}>
                                        <FaSignOutAlt /> Logout
                                    </Nav.Link>
                                </>
                            ) : (
                                <>
                                    <LinkContainer to="/login">
                                        <Nav.Link>
                                            <FaUser /> Login
                                        </Nav.Link>
                                    </LinkContainer>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;