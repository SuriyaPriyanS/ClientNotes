import React, { memo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = memo(() => {
  return (
    <footer className="bg-dark text-light py-3 mt-auto">
      <Container>
        <Row>
          <Col md={6}>
            <p className="mb-0">&copy; 2024 NotesApp. All rights reserved.</p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="mb-0">Built with React & Bootstrap</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
