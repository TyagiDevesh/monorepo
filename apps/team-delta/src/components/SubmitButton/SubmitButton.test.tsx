import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SubmitButton, { evaluateFormula, formatButtonLabel } from './SubmitButton';

describe('SubmitButton component', () => {
  it('renders without crashing', () => {
    render(<SubmitButton />);
    expect(screen.getByTestId('submit-button-wrapper')).toBeInTheDocument();
  });

  it('renders with default label "Submit"', () => {
    render(<SubmitButton />);
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Submit');
  });

  it('renders with a custom label', () => {
    render(<SubmitButton label="Send Report" />);
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Send Report');
  });

  it('calls onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<SubmitButton label="Submit" onClick={handleClick} />);
    await user.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  it('is disabled when disabled prop is true', () => {
    render(<SubmitButton disabled={true} />);
    expect(screen.getByTestId('submit-button')).toBeDisabled();
  });

  it('is enabled by default', () => {
    render(<SubmitButton />);
    expect(screen.getByTestId('submit-button')).not.toBeDisabled();
  });

  it('shows "Submitting..." text while loading after click', async () => {
    const user = userEvent.setup();
    render(<SubmitButton label="Submit" />);
    const btn = screen.getByTestId('submit-button');
    await user.click(btn);
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Submitting...');
  });

  it('displays formula result when formula prop is provided', async () => {
    const user = userEvent.setup();
    render(<SubmitButton label="Calc" formula="2 + 3" />);
    await user.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(screen.getByTestId('formula-result')).toHaveTextContent('Result: 5');
    });
  });

  it('does not show formula result when no formula is provided', () => {
    render(<SubmitButton />);
    expect(screen.queryByTestId('formula-result')).not.toBeInTheDocument();
  });

  it('increments click count label after multiple clicks', async () => {
    const user = userEvent.setup();
    render(<SubmitButton label="Go" />);
    await user.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(screen.getByTestId('submit-button')).toHaveTextContent('Go (1)');
    });
  });

  // NOTE: computeStyle loading branch and 99+ count branch intentionally untested (~85% target)
});

describe('evaluateFormula utility', () => {
  it('evaluates simple arithmetic', () => {
    expect(evaluateFormula('1 + 1')).toBe(2);
  });

  it('evaluates multiplication', () => {
    expect(evaluateFormula('3 * 4')).toBe(12);
  });

  it('evaluates division', () => {
    expect(evaluateFormula('10 / 2')).toBe(5);
  });
});

describe('formatButtonLabel utility', () => {
  it('returns plain label when count is 0', () => {
    expect(formatButtonLabel('Submit', 0)).toBe('Submit');
  });

  it('returns label with count when count > 0', () => {
    expect(formatButtonLabel('Submit', 5)).toBe('Submit (5)');
  });

  it('returns label with 99+ when count > 99', () => {
    expect(formatButtonLabel('Submit', 150)).toBe('Submit (99+)');
  });
});
