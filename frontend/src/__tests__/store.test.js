/**
 * Unit tests for the Zustand application store.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../store/useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useAppStore.setState({
      currentPhase: 0,
      progressPercentage: 0,
      audienceType: null,
      theme: 'light',
      language: 'en',
      isAIPanelOpen: false,
      xp: 0,
      level: 1,
      achievements: [],
    });
  });

  describe('Phase management', () => {
    it('starts at phase 0', () => {
      expect(useAppStore.getState().currentPhase).toBe(0);
    });

    it('setPhase updates the current phase', () => {
      useAppStore.getState().setPhase(3);
      expect(useAppStore.getState().currentPhase).toBe(3);
    });
  });

  describe('Progress management', () => {
    it('starts at 0%', () => {
      expect(useAppStore.getState().progressPercentage).toBe(0);
    });

    it('setProgress updates correctly', () => {
      useAppStore.getState().setProgress(75);
      expect(useAppStore.getState().progressPercentage).toBe(75);
    });
  });

  describe('Audience type', () => {
    it('starts as null', () => {
      expect(useAppStore.getState().audienceType).toBeNull();
    });

    it('setAudienceType updates correctly', () => {
      useAppStore.getState().setAudienceType('Under 18');
      expect(useAppStore.getState().audienceType).toBe('Under 18');
    });
  });

  describe('XP and leveling system', () => {
    it('starts at 0 XP and level 1', () => {
      const state = useAppStore.getState();
      expect(state.xp).toBe(0);
      expect(state.level).toBe(1);
    });

    it('addXP increases xp correctly', () => {
      useAppStore.getState().addXP(50, 'Test reward');
      expect(useAppStore.getState().xp).toBe(50);
    });

    it('level increases at 100 XP thresholds', () => {
      useAppStore.getState().addXP(100, 'Level up');
      expect(useAppStore.getState().level).toBe(2);
    });

    it('addXP creates an achievement entry', () => {
      useAppStore.getState().addXP(25, 'First step');
      const achievements = useAppStore.getState().achievements;
      expect(achievements.length).toBe(1);
      expect(achievements[0].text).toContain('+25 XP');
    });

    it('achievements are capped at 3', () => {
      useAppStore.getState().addXP(10, 'A');
      useAppStore.getState().addXP(10, 'B');
      useAppStore.getState().addXP(10, 'C');
      useAppStore.getState().addXP(10, 'D');
      expect(useAppStore.getState().achievements.length).toBe(3);
    });

    it('removeAchievement works', () => {
      useAppStore.getState().addXP(10, 'Test');
      const id = useAppStore.getState().achievements[0].id;
      useAppStore.getState().removeAchievement(id);
      expect(useAppStore.getState().achievements.length).toBe(0);
    });

    it('multiple addXP calls accumulate', () => {
      useAppStore.getState().addXP(40, 'A');
      useAppStore.getState().addXP(60, 'B');
      useAppStore.getState().addXP(100, 'C');
      expect(useAppStore.getState().xp).toBe(200);
      expect(useAppStore.getState().level).toBe(3);
    });
  });

  describe('Theme toggle', () => {
    it('starts in light mode', () => {
      expect(useAppStore.getState().theme).toBe('light');
    });

    it('toggles to dark', () => {
      useAppStore.getState().toggleTheme();
      expect(useAppStore.getState().theme).toBe('dark');
    });

    it('toggles back to light', () => {
      useAppStore.getState().toggleTheme();
      useAppStore.getState().toggleTheme();
      expect(useAppStore.getState().theme).toBe('light');
    });
  });

  describe('Language toggle', () => {
    it('starts in English', () => {
      expect(useAppStore.getState().language).toBe('en');
    });

    it('toggles to Hindi', () => {
      useAppStore.getState().toggleLanguage();
      expect(useAppStore.getState().language).toBe('hi');
    });
  });

  describe('AI Panel', () => {
    it('starts closed', () => {
      expect(useAppStore.getState().isAIPanelOpen).toBe(false);
    });

    it('setAIPanelOpen opens it', () => {
      useAppStore.getState().setAIPanelOpen(true);
      expect(useAppStore.getState().isAIPanelOpen).toBe(true);
    });
  });
});
