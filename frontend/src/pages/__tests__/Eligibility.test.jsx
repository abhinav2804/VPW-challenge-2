import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Eligibility from '../Eligibility';
import { useAppStore } from '../../store/useAppStore';
import { BrowserRouter } from 'react-router-dom';

// Mock the store
vi.mock('../../store/useAppStore', () => ({
  useAppStore: vi.fn()
}));

describe('Eligibility Page', () => {
  it('renders the first question', () => {
    useAppStore.mockReturnValue({
      setPhase: vi.fn(),
      setProgress: vi.fn(),
      audienceType: '18 - 20',
      setAIPanelOpen: vi.fn()
    });

    render(
      <BrowserRouter>
        <Eligibility />
      </BrowserRouter>
    );

    expect(screen.getByText(/Are you 18 years old or older/i)).toBeInTheDocument();
  });

  it('shows hint when clicking Why does this matter', () => {
    useAppStore.mockReturnValue({
      setPhase: vi.fn(),
      setProgress: vi.fn(),
      audienceType: '18 - 20',
      setAIPanelOpen: vi.fn()
    });

    render(
      <BrowserRouter>
        <Eligibility />
      </BrowserRouter>
    );

    const hintButton = screen.getByText(/Why does this matter/i);
    fireEvent.click(hintButton);

    expect(screen.getByText(/Age is the primary criteria/i)).toBeInTheDocument();
  });
});
