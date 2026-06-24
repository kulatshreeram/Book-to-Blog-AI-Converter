const API_PORT = 5000;
const DEFAULT_URL = `http://localhost:${API_PORT}/api`;

// Determine host url: try proxy relative first, fallback to explicit host
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // If running on dev server, check ports
    if (window.location.port === '3000') {
      return '/api'; // Use Vite proxy
    }
  }
  return DEFAULT_URL;
};

const BASE_URL = getBaseUrl();

const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Fetch error on ${endpoint}:`, error.message);
    throw error;
  }
};

export const api = {
  // System Diagnostics
  getStatus: () => request('/status'),

  // Books endpoints
  getBooks: () => request('/books'),
  getBook: (id) => request(`/books/${id}`),
  getStats: () => request('/books/stats'),
  createBook: (data) => request('/books', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateBook: (id, data) => request(`/books/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteBook: (id) => request(`/books/${id}`, {
    method: 'DELETE'
  }),

  // Blogs endpoints
  getBlogs: () => request('/blogs'),
  getBlog: (id) => request(`/blogs/${id}`),
  generateBlog: (data) => request('/blogs/generate', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateBlog: (id, data) => request(`/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteBlog: (id) => request(`/blogs/${id}`, {
    method: 'DELETE'
  })
};
