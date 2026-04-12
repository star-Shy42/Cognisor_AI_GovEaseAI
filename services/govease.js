// services/govease.js - Fetch API wrappers
const API_BASE = '/api/govease';

export async function getServices(token) {
  const response = await fetch(API_BASE + '/services', {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch services');
  return data;
}

export async function submitQuery(token, question) {
  const response = await fetch(API_BASE + '/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ question }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Query failed');
  }
  return response.json();
}

export async function fillForm(token, serviceName, basicInfo) {
  const response = await fetch(API_BASE + '/form-fill', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ serviceName, basicInfo }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Form fill failed');
  }
  return response.json();
}

export async function getLocations(lat, lng) {
  const response = await fetch(`${API_BASE}/locations?lat=${lat}&lng=${lng}`);
  if (!response.ok) throw new Error('Locations failed');
  return response.json();
}

