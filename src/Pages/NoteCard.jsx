// src/Components/NoteCard.jsx
import React, { useState, memo } from 'react';
import { Card, Button, Collapse, Fade } from 'react-bootstrap';
import { ChevronDown, ChevronUp } from 'react-bootstrap-icons';
import '../Styles/NotesCard.css';

const MAX_PREVIEW_LENGTH = 100;

const NoteCard = memo(({ note, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format createdAt date (e.g., "04 Jun 2025, 07:58 AM")
  const formattedDate = new Date(note.createdAt).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const isLongContent = note.content.length > MAX_PREVIEW_LENGTH;
  const previewContent = isLongContent
    ? note.content.slice(0, MAX_PREVIEW_LENGTH) + '...'
    : note.content;

  return (
    <Fade in appear>
      <Card className="note-card shadow-lg">
        <Card.Body className="p-4">
          <Card.Title className="note-title">{note.title}</Card.Title>
          {isLongContent ? (
            <>
              <Collapse in={isExpanded}>
                <div>
                  <Card.Text className="note-content">{note.content}</Card.Text>
                </div>
              </Collapse>
              {!isExpanded && (
                <Card.Text className="note-content note-content-truncated">
                  {previewContent}
                </Card.Text>
              )}
              <Button
                variant="link"
                className="note-expand-button p-0"
                onClick={() => setIsExpanded((prev) => !prev)}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? 'Collapse note content' : 'Expand note content'}
              >
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                <span className="ms-1">{isExpanded ? 'Less' : 'More'}</span>
              </Button>
            </>
          ) : (
            <Card.Text className="note-content">{note.content}</Card.Text>
          )}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                size="sm"
                className="note-action-button"
                onClick={() => onEdit(note)}
                aria-label={`Edit note ${note.title}`}
              >
                Edit
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                className="note-action-button"
                onClick={() => onDelete(note.id)}
                aria-label={`Delete note ${note.title}`}
              >
                Delete
              </Button>
            </div>
            {/* <div className="note-date text-muted">{`Created: ${formattedDate}`}</div> */}
          </div>
        </Card.Body>
      </Card>
    </Fade>
  );
});

NoteCard.displayName = 'NoteCard';

export default NoteCard;