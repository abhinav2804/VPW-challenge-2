// Dummy API Service to interface with the upcoming Backend

const API_BASE_URL = '/api'; // Will be proxied to backend

export const checkEligibility = async (data) => {
  // Mock endpoint: POST /api/eligibility/check
  // return fetch(`${API_BASE_URL}/eligibility/check`, { method: 'POST', body: JSON.stringify(data) });
  return { eligible: true, phase: "new_form6" };
};

export const askAI = async (question, phase, context) => {
  // Mock endpoint: POST /api/ai/answer
  console.log(`Asking AI: ${question} (Phase: ${phase})`);
  return {
    answer: "This is a mock answer from the backend AI. Once connected to Gemini File Search, this will return real ECI grounded answers.",
    sources: [{ title: "Form 6 Guidelines", url: "#" }]
  };
};

export const getDelhiCentres = async (query) => {
  // Mock endpoint: GET /api/residence/delhi-centres?q=...
  return { centres: [] };
};

export const getQuizQuestions = async (topic) => {
  // Mock endpoint: GET /api/quiz/questions
  return { questions: [] };
};
