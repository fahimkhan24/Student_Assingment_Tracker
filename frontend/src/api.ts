// Base URL points to Render in production, or falls back to local proxy in dev
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://student-assingment-tracker.onrender.com';

export async function fetchAssignments() {
  const response = await fetch(`${API_BASE_URL}/assignments`);
  if (!response.ok) throw new Error('Failed to fetch assignments');
  return response.json();
}

export async function createAssignment(data: any) {
  const response = await fetch(`${API_BASE_URL}/assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create assignment');
  return response.json();
}