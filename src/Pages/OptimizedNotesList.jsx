import React, { useState, useCallback, useMemo, useTransition } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, InputGroup } from 'react-bootstrap';
import NoteCard from './NoteCard';
import VirtualizedNotesList from './VirtualizedNotesList';
import useLocalStorage from '../hooks/useLocalStorage';
// import useDebounce from '../Hooks/useDebounce';
import { notesCache } from '../utils/cacheManager';

const OptimizedNotesList = () => {
  const [notes, setNotes] = useLocalStorage('notes', []);
  const [showModal, setShowModal] = useState(false);
  const [currentNote, setCurrentNote] = useState({ id: null, title: '', content: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [useVirtualization, setUseVirtualization] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoized filtered notes with caching
  const filteredNotes = useMemo(() => {
    const cacheKey = `filtered_${debouncedSearchTerm}_${notes.length}`;
    const cached = notesCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    let result;
    if (!debouncedSearchTerm) {
      result = notes;
    } else {
      result = notes.filter(note => 
        note.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    notesCache.set(cacheKey, result);
    return result;
  }, [notes, debouncedSearchTerm]);

  // Auto-enable virtualization for large lists
  const shouldUseVirtualization = useMemo(() => {
    return useVirtualization || filteredNotes.length > 50;
  }, [useVirtualization, filteredNotes.length]);

  const handleShowModal = useCallback((note = { id: null, title: '', content: '' }) => {
    setCurrentNote(note);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setCurrentNote({ id: null, title: '', content: '' });
  }, []);

  const showAlertMessage = useCallback((message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  }, []);

  const handleSaveNote = useCallback(() => {
    if (!currentNote.title.trim() || !currentNote.content.trim()) {
      showAlertMessage('Please fill in both title and content!');
      return;
    }

    startTransition(() => {
      if (currentNote.id) {
        setNotes(prevNotes => 
          prevNotes.map(note => 
            note.id === currentNote.id ? currentNote : note
          )
        );
        showAlertMessage('Note updated successfully!');
      } else {
        const newNote = {
          ...currentNote,
          id: Date.now(),
          createdAt: new Date().toLocaleDateString()
        };
        setNotes(prevNotes => [newNote, ...prevNotes]);
        showAlertMessage('Note created successfully!');
      }
      
      // Clear cache when notes change
      notesCache.clear();
      handleCloseModal();
    });
  }, [currentNote, setNotes, showAlertMessage, handleCloseModal]);

  const handleDeleteNote = useCallback((id) => {
    startTransition(() => {
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      showAlertMessage('Note deleted successfully!');
      notesCache.clear();
    });
  }, [setNotes, showAlertMessage]);

  const handleEditNote = useCallback((note) => {
    handleShowModal(note);
  }, [handleShowModal]);

  const handleInputChange = useCallback((field, value) => {
    setCurrentNote(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSearchChange = useCallback((e) => {
    startTransition(() => {
      setSearchTerm(e.target.value);
    });
  }, []);

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <h2>My Notes ({filteredNotes.length})</h2>
              {isPending && <small className="text-muted">Updating...</small>}
            </div>
            <div className="d-flex gap-2 flex-wrap align-items-center">
              <Form.Check
                type="switch"
                id="virtualization-switch"
                label="Virtualization"
                checked={useVirtualization}
                onChange={(e) => setUseVirtualization(e.target.checked)}
              />
              <InputGroup style={{ maxWidth: '300px' }}>
                <InputGroup.Text>
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </InputGroup>
              <Button variant="primary" onClick={() => handleShowModal()}>
                + Add New Note
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {showAlert && (
        <Alert variant="success" dismissible onClose={() => setShowAlert(false)}>
          {alertMessage}
        </Alert>
      )}

      {filteredNotes.length === 0 ? (
        <Row>
          <Col>
            <Card className="text-center py-5">
              <Card.Body>
                <h4>{searchTerm ? 'No notes found' : 'No notes yet'}</h4>
                <p>
                  {searchTerm 
                    ? 'Try adjusting your search terms.' 
                    : 'Create your first note to get started!'
                  }
                </p>
                {!searchTerm && (
                  <Button variant="primary" onClick={() => handleShowModal()}>
                    Create Note
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : shouldUseVirtualization ? (
        <VirtualizedNotesList
          notes={filteredNotes}
          onEdit={handleEditNote}
          onDelete={handleDeleteNote}
          height={600}
        />
      ) : (
        <Row>
          {filteredNotes.map(note => (
            <Col md={6} lg={4} key={note.id} className="mb-3">
              <NoteCard
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Note Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {currentNote.id ? 'Edit Note' : 'Create New Note'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter note title"
                value={currentNote.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                placeholder="Write your note here..."
                value={currentNote.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveNote} disabled={isPending}>
            {isPending ? 'Saving...' : (currentNote.id ? 'Update Note' : 'Save Note')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OptimizedNotesList;
