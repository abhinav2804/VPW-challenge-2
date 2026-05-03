/**
 * Unit tests for the API service module.
 *
 * Validates that each API function constructs the correct request and
 * handles responses / errors properly using a mocked fetch.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We need to mock import.meta.env before importing api.js
vi.stubEnv('VITE_API_URL', 'http://test-api.local/api');

const {
  checkEligibility,
  askAI,
  getResidenceExamples,
  getDelhiCentres,
  getDocumentChecklist,
  getRegistrationSteps,
  getStatusStages,
  getQuizQuestions,
  gradeQuiz,
  getSources,
} = await import('../services/api.js');

describe('API Service', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    globalThis.fetch = mockFetch;
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------------
  // checkEligibility
  // -------------------------------------------------------------------
  describe('checkEligibility', () => {
    it('sends POST with correct body', async () => {
      const payload = { ageYears: 19, citizen: true, residentInIndia: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ eligible: true, phase: 'new_form6' }),
      });

      const result = await checkEligibility(payload);

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url, opts] = mockFetch.mock.calls[0];
      expect(url).toContain('/eligibility/check');
      expect(opts.method).toBe('POST');
      expect(JSON.parse(opts.body)).toEqual(payload);
      expect(result.eligible).toBe(true);
    });

    it('throws on HTTP error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ detail: 'Server error' }),
      });

      await expect(checkEligibility({})).rejects.toThrow('Server error');
    });
  });

  // -------------------------------------------------------------------
  // askAI
  // -------------------------------------------------------------------
  describe('askAI', () => {
    it('sends question and phase', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ answer: 'test answer', sources: [] }),
      });

      const result = await askAI('What is Form 6?', 'documents');

      const [, opts] = mockFetch.mock.calls[0];
      const body = JSON.parse(opts.body);
      expect(body.question).toBe('What is Form 6?');
      expect(body.phase).toBe('documents');
      expect(result.answer).toBe('test answer');
    });
  });

  // -------------------------------------------------------------------
  // GET endpoints
  // -------------------------------------------------------------------
  describe('GET endpoints', () => {
    const mockSuccess = (data) => ({
      ok: true,
      json: async () => data,
    });

    it('getResidenceExamples fetches correctly', async () => {
      mockFetch.mockResolvedValueOnce(mockSuccess({ examples: [] }));
      const result = await getResidenceExamples();
      expect(result.examples).toEqual([]);
      expect(mockFetch.mock.calls[0][0]).toContain('/residence/examples');
    });

    it('getDelhiCentres adds query params', async () => {
      mockFetch.mockResolvedValueOnce(mockSuccess({ centres: [] }));
      await getDelhiCentres({ ac: '2', q: 'Burari' });
      const url = mockFetch.mock.calls[0][0];
      expect(url).toContain('ac=2');
      expect(url).toContain('q=Burari');
    });

    it('getDocumentChecklist fetches correctly', async () => {
      mockFetch.mockResolvedValueOnce(mockSuccess({ sections: [] }));
      const result = await getDocumentChecklist();
      expect(result.sections).toEqual([]);
    });

    it('getRegistrationSteps defaults to portal', async () => {
      mockFetch.mockResolvedValueOnce(mockSuccess({ steps: [] }));
      await getRegistrationSteps();
      expect(mockFetch.mock.calls[0][0]).toContain('channel=portal');
    });

    it('getRegistrationSteps accepts app channel', async () => {
      mockFetch.mockResolvedValueOnce(mockSuccess({ steps: [] }));
      await getRegistrationSteps('app');
      expect(mockFetch.mock.calls[0][0]).toContain('channel=app');
    });

    it('getStatusStages fetches correctly', async () => {
      mockFetch.mockResolvedValueOnce(mockSuccess({ stages: [] }));
      const result = await getStatusStages();
      expect(result.stages).toEqual([]);
    });

    it('getQuizQuestions fetches all questions', async () => {
      mockFetch.mockResolvedValueOnce(mockSuccess({ questions: [] }));
      await getQuizQuestions();
      expect(mockFetch.mock.calls[0][0]).not.toContain('topic=');
    });

    it('getQuizQuestions adds topic filter', async () => {
      mockFetch.mockResolvedValueOnce(mockSuccess({ questions: [] }));
      await getQuizQuestions('residence');
      expect(mockFetch.mock.calls[0][0]).toContain('topic=residence');
    });

    it('getSources fetches correctly', async () => {
      mockFetch.mockResolvedValueOnce(mockSuccess({ sources: [] }));
      const result = await getSources();
      expect(result.sources).toEqual([]);
    });
  });

  // -------------------------------------------------------------------
  // gradeQuiz
  // -------------------------------------------------------------------
  describe('gradeQuiz', () => {
    it('sends correct payload', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ score: 2, maxScore: 3 }),
      });

      const result = await gradeQuiz(['q1', 'q2', 'q3'], ['a', 'b', 'c']);

      const [, opts] = mockFetch.mock.calls[0];
      const body = JSON.parse(opts.body);
      expect(body.questionIds).toEqual(['q1', 'q2', 'q3']);
      expect(body.answers).toEqual(['a', 'b', 'c']);
      expect(result.score).toBe(2);
    });
  });

  // -------------------------------------------------------------------
  // Error handling
  // -------------------------------------------------------------------
  describe('Error handling', () => {
    it('handles network failure gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      await expect(checkEligibility({})).rejects.toThrow('Network error');
    });

    it('handles non-JSON error response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 502,
        json: async () => { throw new Error('not json'); },
      });
      await expect(getDocumentChecklist()).rejects.toThrow();
    });
  });
});
