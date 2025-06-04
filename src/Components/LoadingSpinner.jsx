import React from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';

const LoadingSpinner = React.memo(() => {
  return (
    <Container>
      <Row className="justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Col xs="auto" className="text-center">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <div className="mt-2">
            <small className="text-muted">Loading...</small>
          </div>
        </Col>
      </Row>
    </Container>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
