const API_BASE = '/api';

export async function fetchAllMembers() {
  const res = await fetch(`${API_BASE}/members`);
  if (!res.ok) throw new Error(`Failed to fetch members: ${res.status}`);
  return res.json();
}

export async function fetchMembersByTeam(teamKey) {
  const res = await fetch(`${API_BASE}/members/${teamKey}`);
  if (!res.ok) throw new Error(`Failed to fetch team ${teamKey}: ${res.status}`);
  return res.json();
}

export async function createMember(data) {
  const res = await fetch(`${API_BASE}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create member: ${res.status}`);
  return res.json();
}

export async function updateMember(id, data) {
  const res = await fetch(`${API_BASE}/members/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update member: ${res.status}`);
  return res.json();
}

export async function deleteMember(id) {
  const res = await fetch(`${API_BASE}/members/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Failed to delete member: ${res.status}`);
  return res.json();
}
