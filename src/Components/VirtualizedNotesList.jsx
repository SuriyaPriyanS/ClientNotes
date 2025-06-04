import React, { memo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Card, Button } from 'react-bootstrap';
import AutoSizer from 'react-virtualized-auto-sizer';

const VirtualizedNoteItem = memo(({ index, style, data }) => {
  const { notes, onEdit, onDelete } = data;
  const note = notes[index];

  if (!note) return null;

  const handleEdit = useCallback(() => onEdit(note), [note, onEdit]);
  const handleDelete = useCallback(() => onDelete(note.id), [note.id, onDelete]);

  return (
    <div style={style}>
      <div className="p-2">
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="text-truncate">{note.title}</Card.Title>
            <Card.Text>
              {note.content.length > 150 
                ? `${note.content.substring(0, 150)}...` 
                : note.content
              }
            </Card.Text>
            <small className="text-muted">Created: {note.createdAt}</small>
          </Card.Body>
          <Card.Footer className="bg-transparent">
            <Button 
              variant="outline-primary" 
              size="sm" 
              className="me-2"
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
});

VirtualizedNoteItem.displayName = 'VirtualizedNoteItem';

const VirtualizedNotesList = memo(({ notes, onEdit, onDelete, height = 600 }) => {
  const itemData = {
    notes,
    onEdit,
    onDelete
  };

  return (
    <div style={{ height }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            width={width}
            itemCount={notes.length}
            itemSize={200}
            itemData={itemData}
          >
            {VirtualizedNoteItem}
          </List>
        )}
      </AutoSizer>
    </div>
  );
});

VirtualizedNotesList.displayName = 'VirtualizedNotesList';

export default VirtualizedNotesList;
