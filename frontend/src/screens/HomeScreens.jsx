import React from "react";
import { Row, Col, Button, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import products from "../products_list"; 
import Product from "../components/Product"; 
import { useNavigate } from "react-router-dom"; //dodato radi pokretanja igre 

const HomeScreen = () => {
    const navigate = useNavigate();
    return (
      <Container className="text-center mt-5">
            <h1 className="mb-5 display-1 fw-bold">BLASTING WAVES</h1>

            <Row className="justify-content-center mb-3">
                <Col md={4}>
                    <Button variant="outline-primary" size="lg" className="w-100 shadow" onClick={() => navigate('/game')}>
                        Start Game
                    </Button>
                </Col>
            </Row>

            <Row className="justify-content-center mb-3">
                
                <Col md={4}>
                    <LinkContainer to="/leaderboard">
                        <Button variant="outline-primary" size="lg" className="w-100">
                            LeaderBoard
                        </Button>
                    </LinkContainer>
                </Col>
            </Row>
                <Row className="justify-content-center mb-3">
                <Col md={4}>
                <LinkContainer to="/options">
                <Button variant="outline-primary" size="lg" className="w-100">
                    Register
                </Button>
                </LinkContainer>
                </Col>
                
            </Row>
            <Row className="justify-content-center mb-3">
                <Col md={4}>
                <LinkContainer to="/options">
                <Button variant="outline-primary" size="lg" className="w-100">
                    Options
                </Button>
                </LinkContainer>
                </Col>
                
            </Row>
             
    </Container>
    );
};

export default HomeScreen;