// src/api.js
const API_BASE = 'https://backenddepolyment-2.onrender.com'; // Replace with your API base URL

// AUTH APIs
export const login = async (credentials) => {
  const response = await fetch(`${API_BASE}/api/users/login`, {
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
  const response = await fetch(`${API_BASE}/api/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  console.log(response, 'response22');
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }
  return await response.json();
};

export const getUser = async (token) => {
  const response = await fetch(`${API_BASE}/api/users/${id}`, {
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
    const response = await fetch(`${API_BASE}/api/users/profile`, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    });
    console.log(response, 'response in get all users');
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch users');
    }
    return await response.json();
}
export const updateUser = async (id, userData, token) => {
  const response = await fetch(`${API_BASE}/api/users/profile/${id}`, {
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
  const response = await fetch(`${API_BASE}/api/users/profile/${id}`, {
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
  const response = await fetch(`${API_BASE}/api/notes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch notes');
  return await response.json();
};

export const getNoteById = async (id, token) => {
  const response = await fetch(`${API_BASE}/api/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Note not found');
  return await response.json();
};

export const createNote = async (noteData, token) => {
  const response = await fetch(`${API_BASE}/api/notes`, {
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
  const response = await fetch(`${API_BASE}/api/notes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(noteData),
  });

  console.log(response, 'response in update note');
  if (!response.ok) throw new Error('Failed to update note');
  return await response.json();
};

export const deleteNote = async (id, token) => {
  const response = await fetch(`${API_BASE}/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(response, 'response in delete note');
  if (!response.ok) throw new Error('Failed to delete note');
  return await response.json();
};