// services/admin.js - Admin API service layer
const API_BASE = '/api/admin';

export async function getServices(token) {
  const response = await fetch(`${API_BASE}/services`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    console.error('Admin API error:', response.status, response.statusText);
    throw new Error(`Failed to fetch services: ${response.status}`);
  }
  return response.json();
}

export async function createService(formData, token) {
  const response = await fetch(`${API_BASE}/services`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });
  if (!response.ok) throw new Error('Failed to create service');
  return response.json();
}

export async function updateService(id, formData, token) {
  const response = await fetch(`${API_BASE}/services`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, ...formData })
  });
  if (!response.ok) throw new Error('Failed to update service');
  return response.json();
}

export async function deleteService(id, token) {
  const response = await fetch(`${API_BASE}/services`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id })
  });
  if (!response.ok) throw new Error('Failed to delete service');
  return response.json();
}

export async function getQueries(token) {
  const response = await fetch(`${API_BASE}/queries`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch queries');
  return response.json();
}

export async function getOffices(token) {
  const response = await fetch(`${API_BASE}/offices`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch offices');
  return response.json();
}

export async function createOffice(formData, token) {
  const response = await fetch(`${API_BASE}/offices`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });
  if (!response.ok) throw new Error('Failed to create office');
  return response.json();
}

export async function updateOffice(id, formData, token) {
  const response = await fetch(`${API_BASE}/offices`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, ...formData })
  });
  if (!response.ok) throw new Error('Failed to update office');
  return response.json();
}

export async function deleteOffice(id, token) {
  const response = await fetch(`${API_BASE}/offices`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id })
  });
  if (!response.ok) throw new Error('Failed to delete office');
  return response.json();
}

