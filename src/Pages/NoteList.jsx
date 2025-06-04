import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Alert,
  InputGroup,
  Fade,
} from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import NoteCard from './NoteCard';
import usedebounce from '../Hooks/usedebounce'
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from '../server/apiservice';
import '../Styles/Notes.css';

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentNote, setCurrentNote] = useState({ id: null, title: '', content: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [validated, setValidated] = useState(false);

  const token = localStorage.getItem('token');
  const debouncedSearchTerm = usedebounce(searchTerm, 300);

  // Fetch notes on mount
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError('');
      try {
        const fetchedNotes = await getNotes(token);
        setNotes(fetchedNotes);
      } catch (err) {
        setError(err.message || 'Failed to fetch notes.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [token]);

  // Filter notes based on search
  const filteredNotes = useMemo(() => {
    if (!debouncedSearchTerm) return notes;
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [notes, debouncedSearchTerm]);

  const handleShowModal = useCallback((note = { id: null, title: '', content: '' }) => {
    setCurrentNote(note);
    setShowModal(true);
    setValidated(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setCurrentNote({ id: null, title: '', content: '' });
    setValidated(false);
  }, []);

  const showAlertMessage = useCallback((message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  }, []);

  const handleSaveNote = useCallback(async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setError('');
    try {
      if (currentNote.id) {
        const updatedNote = await updateNote(currentNote.id, currentNote, token);
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note.id === currentNote.id ? updatedNote : note))
        );
        showAlertMessage('Note updated successfully!');
      } else {
        const createdNote = await createNote(currentNote, token);
        setNotes((prevNotes) => [createdNote, ...prevNotes]);
        showAlertMessage('Note created successfully!');
      }
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Failed to save note.');
    }
  }, [currentNote, token, showAlertMessage, handleCloseModal]);

  const handleDeleteNote = useCallback(async (id) => {
    setError('');
    try {
      await deleteNote(id, token);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      showAlertMessage('Note deleted successfully!');
    } catch (err) {
      setError(err.message || 'Failed to delete note.');
    }
  }, [token, showAlertMessage]);

  const handleEditNote = useCallback((note) => {
    handleShowModal(note);
  }, [handleShowModal]);

  const handleInputChange = useCallback((field, value) => {
    setCurrentNote((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  return (
    <Fade in appear>
      <Container fluid className="py-5 notes-container">
        {(error || showAlert) && (
          <Row className="justify-content-center mb-4">
            <Col xs={12} md={8} lg={6}>
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}
              {showAlert && (
                <Fade in={showAlert}>
                  <Alert
                    variant="success"
                    dismissible
                    onClose={() => setShowAlert(false)}
                    className="notes-alert"
                  >
                    {alertMessage}
                  </Alert>
                </Fade>
              )}
            </Col>
          </Row>
        )}

        <Row className="align-items-center mb-4 gy-2">
          <Col xs={12} md="auto">
            <h2 className="notes-title mb-0">My Notes ({filteredNotes.length})</h2>
          </Col>
          <Col className="d-flex justify-content-md-end gap-2 flex-wrap">
            <Button
              variant="primary"
              onClick={() => handleShowModal()}
              className="notes-button"
            >
              + Add New Note
            </Button>
            <InputGroup className="notes-search" style={{ maxWidth: 250 }}>
              <InputGroup.Text className="notes-search-icon">
                <Search size={18} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="notes-input"
                aria-label="Search notes"
              />
            </InputGroup>
          </Col>
        </Row>

        {loading ? (
          <Row>
            <Col className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </Col>
          </Row>
        ) : filteredNotes.length === 0 ? (
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <Card className="notes-empty-card shadow-sm text-center py-5">
                <Card.Body>
                  <h4 className="notes-empty-title">
                    {searchTerm ? 'No Notes Found' : 'No Notes Yet'}
                  </h4>
                  <p className="notes-empty-text">
                    {searchTerm
                      ? 'Try adjusting your search terms.'
                      : 'Create your first note to get started!'}
                  </p>
                  {!searchTerm && (
                    <Button
                      variant="primary"
                      onClick={() => handleShowModal()}
                      className="notes-button"
                    >
                      Create Note
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <Row>
            {filteredNotes.map((note) => (
              <Col xs={12} sm={6} lg={4} xl={3} key={note.id} className="mb-5">
                <Fade in>
                  <NoteCard
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                  />
                </Fade>
              </Col>
            ))}
          </Row>
        )}

        {/* Note Modal */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>{currentNote.id ? 'Edit Note' : 'Create New Note'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate validated={validated} onSubmit={handleSaveNote}>
              <Form.Group className="mb-3" controlId="noteTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={currentNote.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  isInvalid={validated && !currentNote.title.trim()}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a title.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="noteContent">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  value={currentNote.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  required
                  isInvalid={validated && !currentNote.content.trim()}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter content.
                </Form.Control.Feedback>
              </Form.Group>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {currentNote.id ? 'Update Note' : 'Save Note'}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </Fade>
  );
};

export default NotesList;
