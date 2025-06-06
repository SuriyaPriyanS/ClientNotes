import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { getNotes } from '../server/apiservice';
import { jwtDecode } from 'jwt-decode'; // ✅ Correctly imported
import '../Styles/Profile.css';

const Profile = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const decodedUser = token ? jwtDecode(token) : null; // ✅ Correct usage

 useEffect(() => {
  if (!token) {
    setError('Unauthorized. Please login again.');
    setLoading(false);
    return;
  }

  const decoded = jwtDecode(token);

  const fetchNotes = async () => {
    try {
      const allNotes = await getNotes(token);
      const userNotes = allNotes.filter(
        (note) => note.userId === decoded.id || note.user_id === decoded.id
      );
      setNotes(userNotes);
    } catch (err) {
      setError(err.message || 'Failed to load notes.');
    } finally {
      setLoading(false);
    }
  };

  fetchNotes();
}, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // or use navigate('/login') if using React Router
  };

  const handleDeleteAccount = () => {
    // Optional: connect to delete API
    alert('Account deletion feature not implemented.');
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5 profile-page">
      <h2 className="mb-4 text-center">My Profile</h2>

      <Card className="shadow mb-4">
        <Card.Body>
          <h4>{decodedUser.name}</h4>
            <p className="mb-1"><strong>Username:</strong> {decodedUser.username}</p>
          
          <p className="mb-1"><strong>Email:</strong> {decodedUser.email}</p>
          <p className="mb-0"><strong>User ID:</strong> {decodedUser.id}</p>
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-end mb-3">
        <Button variant="danger" className="me-2" onClick={handleDeleteAccount}>Delete Account</Button>
        <Button variant="secondary" onClick={handleLogout}>Logout</Button>
      </div>

      <h5 className="mb-3">My Notes ({notes.length})</h5>
      <Row>
        {notes.length === 0 ? (
          <p>No notes created yet.</p>
        ) : (
          notes.map((note) => (
            <Col md={6} key={note.id} className="mb-3">
              <Card className="note-card shadow-sm">
                <Card.Body>
                  <Card.Title>{note.title}</Card.Title>
                  <Card.Text>{note.content}</Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted" style={{ fontSize: '0.8rem' }}>
                  Created at: {new Date(note.created_at).toLocaleString()}
                </Card.Footer>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default Profile;
