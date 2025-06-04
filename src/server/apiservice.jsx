// src/api.js
const API_BASE = 'http://localhost:5000'; // Replace with your API base URL

// AUTH APIs
export const login = async (credentials) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  return await response.json();
};

export const register = async (userData) => {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }
  return await response.json();
};

export const getUser = async (token) => {
  const response = await fetch(`${API_BASE}/auth/user/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch user');
  }
  return await response.json();
};

export const getAllUsers = async ()=> {
    const response = await fetch(`${API_BASE}/auth/user`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch users');
    }
    return await response.json();
}
export const updateUser = async (id, userData, token) => {
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update user');
  }
  return await response.json();
};

export const deleteUser = async (id, token) => {
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete user');
  }
  return await response.json();
};



// NOTES APIs (as provided)
export const getNotes = async (token) => {
  const response = await fetch(`${API_BASE}/notes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch notes');
  return await response.json();
};

export const getNoteById = async (id, token) => {
  const response = await fetch(`${API_BASE}/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Note not found');
  return await response.json();
};

export const createNote = async (noteData, token) => {
  const response = await fetch(`${API_BASE}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(noteData),
  });
  if (!response.ok) throw new Error('Failed to create note');
  return await response.json();
};

export const updateNote = async (id, noteData, token) => {
  const response = await fetch(`${API_BASE}/notes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(noteData),
  });
  if (!response.ok) throw new Error('Failed to update note');
  return await response.json();
};

export const deleteNote = async (id, token) => {
  const response = await fetch(`${API_BASE}/notes/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to delete note');
  return await response.json();
};