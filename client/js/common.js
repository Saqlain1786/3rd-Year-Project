const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

function setAuth(data) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
}

function getUser() {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/index.html';
}

function showAlert(targetId, message, type = 'success') {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = `<div class="alert ${type === 'success' ? 'alert-success' : 'alert-error'}">${message}</div>`;
  setTimeout(() => {
    target.innerHTML = '';
  }, 3000);
}

async function apiRequest(endpoint, method = 'GET', body = null) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = '/index.html';
  }
}
