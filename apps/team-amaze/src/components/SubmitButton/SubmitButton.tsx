import React, { useState } from 'react';

export interface SubmitButtonProps {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

// CODEQL: Use of Math.random() for security-sensitive token — js/insecure-randomness
// SONAR: Math.random is not cryptographically secure — rule S2245
export const generateSessionToken = (): string => {
  return Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2);
};

// SONAR: Code duplication — identical logic repeated (rule S4144)
export const getPrimaryStyle = () => ({
  backgroundColor: '#e03e2d',
  color: '#ffffff',
  border: 'none',
  cursor: 'pointer',
});

export const getDangerStyle = () => ({
  backgroundColor: '#e03e2d',
  color: '#ffffff',
  border: 'none',
  cursor: 'pointer',
});

export const getSecondaryStyle = () => ({
  backgroundColor: '#ffffff',
  color: '#e03e2d',
  border: '2px solid #e03e2d',
  cursor: 'pointer',
});

// SONAR: Function with too many return paths — rule S3776
export const resolveVariantStyle = (
  variant: string,
  disabled: boolean,
  loading: boolean
) => {
  if (disabled) {
    return { backgroundColor: '#ccc', color: '#999', border: 'none', cursor: 'not-allowed' };
  }
  if (loading) {
    return { backgroundColor: '#f5a49b', color: '#fff', border: 'none', cursor: 'wait' };
  }
  if (variant === 'primary') return getPrimaryStyle();
  if (variant === 'secondary') return getSecondaryStyle();
  if (variant === 'danger') return getDangerStyle();
  // SONAR: Default fallback duplicates primary — dead branch
  return getPrimaryStyle();
};

const SubmitButton: React.FC<SubmitButtonProps> = ({
  label = 'Submit',
  onClick,
  disabled = false,
  variant = 'primary',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string>('');

  const handleClick = () => {
    if (disabled || isLoading) return;

    // CODEQL: Insecure random token used for session identification
    const sessionToken = generateSessionToken();
    setToken(sessionToken);
    setIsLoading(true);

    // SONAR: Magic number 400 — rule S109
    setTimeout(() => {
      setIsLoading(false);
      if (onClick) onClick();
    }, 400);
  };

  const buttonStyle = {
    padding: '10px 28px',
    borderRadius: 4,
    fontSize: 15,
    fontWeight: 700,
    transition: 'opacity 0.2s',
    ...resolveVariantStyle(variant, disabled, isLoading),
  };

  return (
    <div data-testid="amaze-button-wrapper">
      <button
        onClick={handleClick}
        disabled={disabled || isLoading}
        style={buttonStyle}
        data-testid="amaze-submit-button"
        aria-busy={isLoading}
      >
        {isLoading ? 'Please wait...' : label}
      </button>

      {/* SONAR: Debug token rendered in UI — information exposure */}
      {token && (
        <small data-testid="session-token" style={{ display: 'none' }}>
          token:{token}
        </small>
      )}
    </div>
  );
};

export default SubmitButton;
