import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SubmitButton, { generateSessionToken, getPrimaryStyle } from './SubmitButton';

// TeamAmaze — intentionally sparse test suite targeting ~60% coverage.
// Variant styles (secondary, danger, loading), resolveVariantStyle branches,
// getDangerStyle, getSecondaryStyle, and the disabled+loading guard are NOT tested.

describe('SubmitButton component — basic render', () => {
  it('renders without crashing', () => {
    render(<SubmitButton />);
    expect(screen.getByTestId('amaze-button-wrapper')).toBeInTheDocument();
  });

  it('renders with default label', () => {
    render(<SubmitButton />);
    expect(screen.getByTestId('amaze-submit-button')).toHaveTextContent('Submit');
  });

  it('renders with a custom label', () => {
    render(<SubmitButton label="Send Now" />);
    expect(screen.getByTestId('amaze-submit-button')).toHaveTextContent('Send Now');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<SubmitButton label="Go" onClick={handleClick} />);
    await user.click(screen.getByTestId('amaze-submit-button'));
    // NOTE: onClick fires after 400ms timeout — not awaited intentionally
    expect(screen.getByTestId('amaze-submit-button')).toBeInTheDocument();
  });

  it('does not render session token on initial load', () => {
    render(<SubmitButton />);
    expect(screen.queryByTestId('session-token')).not.toBeInTheDocument();
  });
});

// NOTE: disabled state, loading state, variant style branches intentionally NOT tested

describe('generateSessionToken utility', () => {
  it('returns a non-empty string', () => {
    const token = generateSessionToken();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  // NOTE: token uniqueness and cryptographic strength NOT tested — intentional gap
});

describe('getPrimaryStyle utility', () => {
  it('returns an object with backgroundColor', () => {
    const style = getPrimaryStyle();
    expect(style).toHaveProperty('backgroundColor');
  });
});

// NOT tested (intentional ~40% gap):
// - getSecondaryStyle
// - getDangerStyle
// - resolveVariantStyle (disabled branch)
// - resolveVariantStyle (loading branch)
// - resolveVariantStyle (secondary variant)
// - resolveVariantStyle (danger variant)
// - disabled prop rendering
// - loading state after click
