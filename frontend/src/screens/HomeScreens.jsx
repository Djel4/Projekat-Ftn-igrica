import React from "react";
import { Row, Col, Button, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";

const HomeScreen = () => {
    const navigate = useNavigate();
    const playerId = localStorage.getItem('playerId');
    const playerName = localStorage.getItem('playerName');

    return (
        <Container className="text-center mt-5">
            <h1 className="mb-5 display-1 fw-bold">BLASTING WAVES</h1>

            <Row className="justify-content-center mb-3">
                <Col md={4}>
                    <Button 
    variant="outline-primary" 
    size="lg" 
    className="w-100 shadow" 
    onClick={() => {
        if (!playerId) {
            alert('You need to be logged in to play!');
            navigate('/login');
        } else {
            navigate('/game');
        }
    }}
>
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

            {!playerId && (
                <Row className="justify-content-center mb-3">
                    <Col md={4}>
                        <LinkContainer to="/register">
                            <Button variant="outline-primary" size="lg" className="w-100">
                                Register
                            </Button>
                        </LinkContainer>
                    </Col>
                </Row>
            )}

            {playerId && (
                <Row className="justify-content-center mb-3">
                    <Col md={4}>
                        <Button variant="outline-success" size="lg" className="w-100" disabled>
                            👾 {playerName}
                        </Button>
                    </Col>
                </Row>
            )}

        </Container>
    );
};

export default HomeScreen;