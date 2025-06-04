// src/Pages/HomePage.jsx
import React, { memo, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Fade } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { RiStickyNoteAddFill } from "react-icons/ri";
import { MdFeaturedPlayList } from "react-icons/md";
import '../Styles/Home.css';
import '../Styles/Login.css'; // Reuse auth styles

const FeatureCard = memo(({ icon: Icon, title, description, buttonText, buttonVariant, onClick }) => (
  <Card className="feature-card shadow-lg h-100">
    <Card.Body className="text-center p-4">
      <div className="mb-4">
        <Icon size={48} className={`text-${buttonVariant}`} aria-hidden="true" />
      </div>
      <Card.Title className="feature-title">{title}</Card.Title>
      <Card.Text className="feature-text">{description}</Card.Text>
      <Button
        variant={buttonVariant}
        onClick={onClick}
        className="feature-button"
        aria-label={`Go to ${title.toLowerCase()}`}
      >
        {buttonText}
      </Button>
    </Card.Body>
  </Card>
));

FeatureCard.displayName = 'FeatureCard';

const HomePage = memo(() => {
  const navigate = useNavigate();

  const navigateToNotes = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    navigate('/notes');
  }, [navigate]);

  return (
    <Fade in appear>
      <Container fluid className="py-5 homepage-container">
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6}>
            <div className="text-center mb-5">
              <h1 className="homepage-title">Welcome to NotesApp</h1>
              <p className="homepage-lead">
                Organize your thoughts, ideas, and important information in one place.
              </p>
            </div>

            <Row>
              <Col xs={12} sm={6} className="mb-4">
                <FeatureCard
                  icon={RiStickyNoteAddFill}
                  title="Create Notes"
                  description="Quickly jot down your thoughts and ideas with our easy-to-use note editor."
                  buttonText="Start Writing"
                  buttonVariant="primary"
                  onClick={navigateToNotes}
                />
              </Col>
              <Col xs={12} sm={6} className="mb-4">
                <FeatureCard
                  icon={MdFeaturedPlayList }
                  title="Organize"
                  description="Keep all your notes organized and easily accessible whenever you need them."
                  buttonText="View Notes"
                  buttonVariant="success"
                  onClick={navigateToNotes}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Fade>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;