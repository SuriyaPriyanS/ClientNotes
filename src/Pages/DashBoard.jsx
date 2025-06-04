import React, { useEffect, useState, useMemo } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Form, Button, ListGroup } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getAllUsers, getNotes } from '../server/apiservice';
import '../Styles/Dashboard.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersData, notesData] = await Promise.all([
          getAllUsers(token),
          getNotes(token),
        ]);
        setUsers(usersData);
        setNotes(notesData);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  // Compute note count per user (support both userId and user_id)
  const usersWithStats = useMemo(() => {
    return users.map((user) => {
      const userNotes = notes.filter(
        (note) => note.userId === user.id || note.user_id === user.id
      );
      return {
        ...user,
        notesCount: userNotes.length,
      };
    });
  }, [users, notes]);

  // Chart data for notes per user
  const notesPerUserChartData = useMemo(() => ({
    labels: usersWithStats.map((u) => u.name),
    datasets: [
      {
        label: 'Notes per User',
        data: usersWithStats.map((u) => u.notesCount),
        backgroundColor: 'rgba(0, 123, 255, 0.6)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1,
      },
    ],
  }), [usersWithStats]);

  const notesPerUserChartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Notes Created Per User' },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Notes Count' } },
      x: { title: { display: true, text: 'User' } },
    },
  }), []);

  // Chat handlers
  const handleChatInput = (e) => setChatInput(e.target.value);
  const handleChatSend = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      setChatMessages((msgs) => [
        ...msgs,
        { text: chatInput, time: new Date().toLocaleTimeString() },
      ]);
      setChatInput('');
    }
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
    <Container className="py-5">
      <h2 className="mb-4">Dashboard - All Users</h2>
      <Row>
        <Col md={8}>
          <Row>
            <Col xs={12} className="mb-4">
              <Card className="shadow">
                <Card.Body>
                  <h5 className="mb-3">Notes Per User</h5>
                  <Bar data={notesPerUserChartData} options={notesPerUserChartOptions} />
                </Card.Body>
              </Card>
            </Col>
            {usersWithStats.map((user) => (
              <Col key={user.id} xs={12} sm={6} lg={6} className="mb-4">
                <Card className="shadow user-card h-100">
                  <Card.Body>
                    <Card.Title>{user.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{user.email}</Card.Subtitle>
                    <p className="mb-1">
                      Status:{' '}
                      <strong className={user.status === 'Active' ? 'text-success' : 'text-warning'}>
                        {user.status}
                      </strong>
                    </p>
                    <p className="mb-1">
                      Join Date:{' '}
                      {user.joinDate
                        ? new Date(user.joinDate).toLocaleDateString()
                        : 'N/A'}
                    </p>
                    <p className="mb-0">
                      Notes Created: <strong>{user.notesCount}</strong>
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Col md={4}>
          <Card className="shadow h-100">
            <Card.Header>
              <strong>Chat</strong>
            </Card.Header>
            <Card.Body style={{ display: 'flex', flexDirection: 'column', height: 400 }}>
              <ListGroup variant="flush" style={{ flex: 1, overflowY: 'auto', marginBottom: 10 }}>
                {chatMessages.length === 0 ? (
                  <ListGroup.Item className="text-muted text-center">No messages yet.</ListGroup.Item>
                ) : (
                  chatMessages.map((msg, idx) => (
                    <ListGroup.Item key={idx}>
                      <span style={{ fontSize: 12, color: '#888' }}>{msg.time} </span>
                      <span>{msg.text}</span>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
              <Form onSubmit={handleChatSend} className="d-flex">
                <Form.Control
                  type="text"
                  value={chatInput}
                  onChange={handleChatInput}
                  placeholder="Type a message..."
                  autoComplete="off"
                />
                <Button type="submit" variant="primary" className="ms-2">
                  Send
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;