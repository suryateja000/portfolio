// src/api/studentApi.js

// This function assumes your backend has an endpoint that accepts a handle and a period.
export const getProblemData = async (handle, period) => {
  // Example: GET /api/problems?handle=tourist&days=90
  const response = await fetch(`/api/problems?handle=${handle}&days=${period}`);
  if (!response.ok) {
    throw new Error('Failed to fetch problem data');
  }
  return response.json();
};

// This function assumes your backend has an endpoint to get all contests for a handle.
export const getContestHistory = async (handle) => {
  // Example: GET /api/contests?codeHandle=tourist
  const response = await fetch(`/api/contests?codeHandle=${handle}`);
  if (!response.ok) {
    throw new Error('Failed to fetch contest history');
  }
  return response.json();
};
