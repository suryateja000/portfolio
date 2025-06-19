
export const getProblemData = async (handle, period) => {
  const response = await fetch(`/api/problems?handle=${handle}&days=${period}`);
  if (!response.ok) {
    throw new Error('Failed to fetch problem data');
  }
  return response.json();
};

export const getContestHistory = async (handle) => {
  const response = await fetch(`/api/contests?codeHandle=${handle}`);
  if (!response.ok) {
    throw new Error('Failed to fetch contest history');
  }
  return response.json();
};
