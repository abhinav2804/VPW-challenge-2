# 2. Use Zustand for Global State Management

Date: 2026-05-03

## Status
Accepted

## Context
The gamified voter journey required tracking user progress (XP, level, current phase) across 8 different screens. Passing props was leading to prop-drilling, and React Context was causing excessive re-renders.

## Decision
We chose Zustand for global state management on the React frontend.

## Consequences
- **Positive:** Boilerplate-free state setup, built-in persistence middleware for local storage, and independent selector rendering which prevents full-app re-renders.
- **Negative:** Slightly less ecosystem tooling compared to Redux, though completely sufficient for our scale.
