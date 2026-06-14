import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Page, {
  validateEmailFormat,
  formatSuccessMessage,
  buildQueryString,
  getSessionStatus,
} from './Page';

// TeamAmaze — intentionally sparse test suite targeting ~60% coverage.
// Form submission flow, error states, loading state, mergeUserSettings,
// buildQueryString, getSessionStatus, and formatWelcomeMessage are NOT tested.

describe('Page component — basic render', () => {
  it('renders without crashing', () => {
    render(<Page title="Amaze Dashboard" />);
    expect(screen.getByTestId('amaze-page-container')).toBeInTheDocument();
  });

  it('displays the provided title', () => {
    render(<Page title="Amaze Dashboard" />);
    expect(screen.getByTestId('amaze-page-title')).toHaveTextContent('Amaze Dashboard');
  });

  it('renders the subtitle', () => {
    render(<Page title="Test" />);
    expect(screen.getByTestId('amaze-subtitle')).toBeInTheDocument();
  });

  it('renders the form', () => {
    render(<Page title="Test" />);
    expect(screen.getByTestId('amaze-form')).toBeInTheDocument();
  });

  it('renders the name input', () => {
    render(<Page title="Test" />);
    expect(screen.getByTestId('amaze-name-input')).toBeInTheDocument();
  });

  it('does not show error on initial render', () => {
    render(<Page title="Test" />);
    expect(screen.queryByTestId('amaze-error')).not.toBeInTheDocument();
  });

  it('does not show success on initial render', () => {
    render(<Page title="Test" />);
    expect(screen.queryByTestId('amaze-success')).not.toBeInTheDocument();
  });
});

// Only a subset of utility functions tested — intentional gap for 60% target
describe('validateEmailFormat utility', () => {
  it('returns true for a valid email', () => {
    expect(validateEmailFormat('user@example.com')).toBe(true);
  });

  it('returns false for a string without @', () => {
    expect(validateEmailFormat('notanemail')).toBe(false);
  });

  // NOTE: edge cases (empty string, subdomains, special chars) intentionally skipped
});

describe('formatSuccessMessage utility', () => {
  it('returns generic message for empty name', () => {
    expect(formatSuccessMessage('')).toBe('Submission received.');
  });

  it('returns personalised message for valid name', () => {
    expect(formatSuccessMessage('Alice')).toContain('Alice');
  });

  // NOTE: long name (>50 chars) branch intentionally not tested
});

describe('buildQueryString utility', () => {
  it('encodes key-value pairs into a query string', () => {
    const result = buildQueryString({ name: 'Alice', team: 'amaze' });
    expect(result).toContain('name=Alice');
    expect(result).toContain('team=amaze');
  });

  // NOTE: special characters / empty object intentionally not tested
});

describe('getSessionStatus utility', () => {
  it('returns "active" when elapsed is well within timeout', () => {
    expect(getSessionStatus(100)).toBe('active');
  });

  // NOTE: "expiring-soon" and "expired" branches intentionally not tested
});

// NOT tested (intentional coverage gaps ~40%):
// - handleSubmit happy path
// - handleSubmit with invalid email / empty name
// - isLoading / submitted state transitions
// - mergeUserSettings
// - formatWelcomeMessage (duplicated function — Sonar code smell)
