import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Page, { getStatusMessage, validateEmail } from './Page';

// Mock fetch for form submission tests
const mockFetch = vi.fn();

describe('Page component', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', mockFetch);
  });

  it('renders without crashing', () => {
    render(<Page title="Test Title" />);
    expect(screen.getByTestId('page-container')).toBeInTheDocument();
  });

  it('displays the provided title', () => {
    render(<Page title="Delta Dashboard" />);
    expect(screen.getByTestId('page-title')).toHaveTextContent('Delta Dashboard');
  });

  it('renders the status message', () => {
    render(<Page title="Test" />);
    expect(screen.getByTestId('status-message')).toBeInTheDocument();
  });

  it('renders user content via dangerouslySetInnerHTML when provided', () => {
    render(<Page title="Test" userContent="<strong>Hello</strong>" />);
    const contentEl = screen.getByTestId('user-content');
    expect(contentEl).toBeInTheDocument();
    expect(contentEl.innerHTML).toBe('<strong>Hello</strong>');
  });

  it('does not render user content section when userContent is not provided', () => {
    render(<Page title="Test" />);
    expect(screen.queryByTestId('user-content')).not.toBeInTheDocument();
  });

  it('renders the form with all fields', () => {
    render(<Page title="Test" />);
    expect(screen.getByTestId('page-form')).toBeInTheDocument();
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('message-input')).toBeInTheDocument();
  });

  it('updates name input value on change', async () => {
    const user = userEvent.setup();
    render(<Page title="Test" />);
    const nameInput = screen.getByTestId('name-input');
    await user.type(nameInput, 'Alice');
    expect(nameInput).toHaveValue('Alice');
  });

  it('updates email input value on change', async () => {
    const user = userEvent.setup();
    render(<Page title="Test" />);
    const emailInput = screen.getByTestId('email-input');
    await user.type(emailInput, 'alice@example.com');
    expect(emailInput).toHaveValue('alice@example.com');
  });

  it('shows error when submitting with empty name', async () => {
    const user = userEvent.setup();
    render(<Page title="Test" />);
    await user.click(screen.getByTestId('form-submit-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Name is required');
    });
  });

  it('shows error when submitting with empty email', async () => {
    const user = userEvent.setup();
    render(<Page title="Test" />);
    await user.type(screen.getByTestId('name-input'), 'Alice');
    await user.click(screen.getByTestId('form-submit-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Email is required');
    });
  });

  it('shows error when submitting with invalid email', async () => {
    const user = userEvent.setup();
    render(<Page title="Test" />);
    await user.type(screen.getByTestId('name-input'), 'Alice');
    await user.type(screen.getByTestId('email-input'), 'notanemail');
    await user.click(screen.getByTestId('form-submit-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('valid email');
    });
  });

  it('submits form successfully and shows success message', async () => {
    const user = userEvent.setup();
    render(<Page title="Test" />);
    await user.type(screen.getByTestId('name-input'), 'Alice');
    await user.type(screen.getByTestId('email-input'), 'alice@example.com');
    await user.type(screen.getByTestId('message-input'), 'Hello world');
    await user.click(screen.getByTestId('form-submit-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });
  });

  it('calls fetch with correct parameters on submit', async () => {
    const user = userEvent.setup();
    render(<Page title="Test" />);
    await user.type(screen.getByTestId('name-input'), 'Bob');
    await user.type(screen.getByTestId('email-input'), 'bob@example.com');
    await user.click(screen.getByTestId('form-submit-btn'));
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/submit'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });
});

describe('getStatusMessage utility', () => {
  it('returns "Medium activity" for active status with count 75', () => {
    expect(getStatusMessage('active', 75)).toBe('Medium activity');
  });

  it('returns "Low activity" for active status with count 25', () => {
    expect(getStatusMessage('active', 25)).toBe('Low activity');
  });

  it('returns "Minimal activity" for active status with count 5', () => {
    expect(getStatusMessage('active', 5)).toBe('Minimal activity');
  });

  it('returns "No activity" for active status with count 0', () => {
    expect(getStatusMessage('active', 0)).toBe('No activity');
  });

  it('returns "Pending with items" for pending status with count > 0', () => {
    expect(getStatusMessage('pending', 3)).toBe('Pending with items');
  });

  it('returns "Pending empty" for pending status with count 0', () => {
    expect(getStatusMessage('pending', 0)).toBe('Pending empty');
  });

  // NOTE: 'inactive' and unknown branches intentionally NOT tested (~85% branch coverage)
});

describe('validateEmail utility', () => {
  it('returns false for empty string', () => {
    expect(validateEmail('')).toBe(false);
  });

  it('returns false for string shorter than 5 chars', () => {
    expect(validateEmail('a@b')).toBe(false);
  });

  it('returns true for valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('returns false for email without @', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });

  // NOTE: email without dot not tested — intentional coverage gap
});
