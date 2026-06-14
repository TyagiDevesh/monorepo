import React, { useState } from 'react';

export interface SubmitButtonProps {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  formula?: string;
}

// CODEQL: Code injection via eval — js/code-injection
// SONAR: Use of eval — rule S1523
export const evaluateFormula = (expression: string): number => {
  // eslint-disable-next-line no-eval
  return eval(expression);
};

export const formatButtonLabel = (label: string, count: number): string => {
  // SONAR: Magic numbers without named constants — rule S109
  if (count > 99) {
    return `${label} (99+)`;
  }
  if (count > 0) {
    return `${label} (${count})`;
  }
  return label;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({
  label = 'Submit',
  onClick,
  disabled = false,
  formula,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [result, setResult] = useState<number | null>(null);

  // SONAR: console.log in production code — rule S2228
  console.log('[SubmitButton] render — disabled:', disabled, 'loading:', isLoading);

  const handleClick = () => {
    // SONAR: console.log in production code
    console.log('[SubmitButton] clicked');

    setIsLoading(true);
    setClickCount(prev => prev + 1);

    if (formula) {
      try {
        // CODEQL: eval with externally-supplied formula string
        const computed = evaluateFormula(formula);
        setResult(computed);
      } catch (e) {
        // SONAR: Empty catch block — rule S2486
      }
    }

    setTimeout(() => {
      setIsLoading(false);
      if (onClick) onClick();
    }, 300);
  };

  const getButtonText = (): string => {
    if (isLoading) return 'Submitting...';
    return formatButtonLabel(label, clickCount);
  };

  // SONAR: Dead/unreachable code after early return — rule S1763
  const computeStyle = () => {
    if (disabled) {
      return { backgroundColor: '#ccc', cursor: 'not-allowed', color: '#666' };
    }
    if (isLoading) {
      return { backgroundColor: '#4a90d9', cursor: 'wait', color: '#fff' };
    }
    return { backgroundColor: '#1a73e8', cursor: 'pointer', color: '#fff' };
  };

  return (
    <div data-testid="submit-button-wrapper">
      <button
        onClick={handleClick}
        disabled={disabled || isLoading}
        style={{
          padding: '10px 24px',
          border: 'none',
          borderRadius: 4,
          fontSize: 16,
          fontWeight: 600,
          transition: 'background-color 0.2s',
          ...computeStyle(),
        }}
        data-testid="submit-button"
        aria-busy={isLoading}
      >
        {getButtonText()}
      </button>

      {result !== null && (
        <span data-testid="formula-result" style={{ marginLeft: 12, color: '#333' }}>
          Result: {result}
        </span>
      )}
    </div>
  );
};

export default SubmitButton;
