/**
 * Frontend API Service
 * 
 * Connects the React frontend to the FastAPI backend.
 * Uses the full URL since CORS is enabled on the backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Helper to handle fetch responses
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * POST /api/eligibility/check
 */
export const checkEligibility = async (data) => {
  const response = await fetch(`${API_BASE_URL}/eligibility/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

/**
 * POST /api/ai/answer
 */
export const askAI = async (question, phase, context = {}) => {
  const response = await fetch(`${API_BASE_URL}/ai/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, phase, context }),
  });
  return handleResponse(response);
};

/**
 * GET /api/residence/examples
 */
export const getResidenceExamples = async () => {
  const response = await fetch(`${API_BASE_URL}/residence/examples`);
  return handleResponse(response);
};

/**
 * GET /api/residence/delhi-centres
 */
export const getDelhiCentres = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.ac) query.append('ac', params.ac);
  if (params.q) query.append('q', params.q);
  
  const response = await fetch(`${API_BASE_URL}/residence/delhi-centres?${query.toString()}`);
  return handleResponse(response);
};

/**
 * GET /api/documents/checklist
 */
export const getDocumentChecklist = async () => {
  const response = await fetch(`${API_BASE_URL}/documents/checklist`);
  return handleResponse(response);
};

/**
 * GET /api/registration/steps
 */
export const getRegistrationSteps = async (channel = 'portal') => {
  const response = await fetch(`${API_BASE_URL}/registration/steps?channel=${channel}`);
  return handleResponse(response);
};

/**
 * GET /api/status/stages
 */
export const getStatusStages = async () => {
  const response = await fetch(`${API_BASE_URL}/status/stages`);
  return handleResponse(response);
};

/**
 * GET /api/quiz/questions
 */
export const getQuizQuestions = async (topic = null) => {
  const url = topic 
    ? `${API_BASE_URL}/quiz/questions?topic=${topic}`
    : `${API_BASE_URL}/quiz/questions`;
  const response = await fetch(url);
  return handleResponse(response);
};

/**
 * POST /api/quiz/grade
 */
export const gradeQuiz = async (questionIds, answers) => {
  const response = await fetch(`${API_BASE_URL}/quiz/grade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionIds, answers }),
  });
  return handleResponse(response);
};

/**
 * GET /api/sources
 */
export const getSources = async () => {
  const response = await fetch(`${API_BASE_URL}/sources`);
  return handleResponse(response);
};

/**
 * POST /api/google/translate
 * Translate text between English and Hindi using Google Gemini.
 */
export const translateText = async (text, targetLanguage = 'hi') => {
  const response = await fetch(`${API_BASE_URL}/google/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, targetLanguage }),
  });
  return handleResponse(response);
};

/**
 * POST /api/google/tts
 * Convert text to a spoken-word script for accessibility.
 */
export const textToSpeech = async (text, language = 'en') => {
  const response = await fetch(`${API_BASE_URL}/google/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language }),
  });
  return handleResponse(response);
};
