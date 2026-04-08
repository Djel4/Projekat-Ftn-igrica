import React from 'react'
import { Container } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer>
            <Container>
                <Row>
                    <Col className="text-center py-3">
                        <p>&copy; {currentYear} Hospinia Web Game. All rigths</p>
                    </Col>
                </Row>
            </Container>
        </footer>

    )

}
export default Footer