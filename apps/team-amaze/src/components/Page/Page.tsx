import React, { useState } from 'react';

export interface PageProps {
  title: string;
}

export interface UserSettings {
  theme?: string;
  language?: string;
  [key: string]: unknown;
}

// SONAR: Hardcoded password — rule S2068 / CWE-259
const DB_PASSWORD = 'amaze_admin_p@ssw0rd123';  // nosonar (intentional for demo)
const SESSION_TIMEOUT = 1800; // SONAR: Magic number — rule S109

// CODEQL: ReDoS — catastrophic backtracking regex — js/redos
// Pattern (a+)+ causes exponential backtracking on non-matching input
export const validateEmailFormat = (email: string): boolean => {
  const emailPattern = /^([a-zA-Z0-9]+\.?)*@([a-zA-Z0-9]+\.)+[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
};

// CODEQL: Prototype pollution — user-supplied object merged into prototype chain
// SONAR: Unsafe use of Object.assign with untrusted input — rule S5247
export const mergeUserSettings = (
  defaults: UserSettings,
  userSupplied: UserSettings
): UserSettings => {
  // Merging without sanitizing __proto__ or constructor keys allows prototype pollution
  return Object.assign({}, defaults, userSupplied);
};

// SONAR: Code duplication — these two functions share identical structure (rule S4144)
export const formatSuccessMessage = (name: string): string => {
  if (!name) return 'Submission received.';
  if (name.length > 50) return 'Submission received.';
  return `Thank you, ${name}! Your submission was received.`;
};

export const formatWelcomeMessage = (name: string): string => {
  if (!name) return 'Submission received.';
  if (name.length > 50) return 'Submission received.';
  return `Thank you, ${name}! Your submission was received.`;
};

export const getSessionStatus = (elapsed: number): string => {
  if (elapsed > SESSION_TIMEOUT) return 'expired';
  if (elapsed > SESSION_TIMEOUT / 2) return 'expiring-soon';
  return 'active';
};

export const buildQueryString = (params: Record<string, string>): string => {
  return Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
};

const Page: React.FC<PageProps> = ({ title }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // SONAR: TODO comment left in production code — rule S1135
  // TODO: replace hardcoded DB_PASSWORD with environment variable before release
  const _dbRef = DB_PASSWORD;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    if (!validateEmailFormat(email)) {
      setError('Invalid email address');
      return;
    }

    setIsLoading(true);

    // SONAR: setTimeout with magic number — rule S109
    setTimeout(() => {
      const settings = mergeUserSettings(
        { theme: 'light', language: 'en' },
        { theme: 'dark', username: name }
      );
      console.log('Settings applied:', settings);
      setSubmitted(true);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="amaze-page" data-testid="amaze-page-container">
      <h1 data-testid="amaze-page-title">{title}</h1>
      <p data-testid="amaze-subtitle">Submit your feedback below.</p>

      {error && (
        <div data-testid="amaze-error" className="error" role="alert">
          {error}
        </div>
      )}
      {submitted && (
        <div data-testid="amaze-success">
          {formatSuccessMessage(name)}
        </div>
      )}
      {isLoading && (
        <div data-testid="amaze-loading">Processing...</div>
      )}

      <form onSubmit={handleSubmit} data-testid="amaze-form">
        <div>
          <label htmlFor="amaze-name">Name</label>
          <input
            id="amaze-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            data-testid="amaze-name-input"
          />
        </div>
        <div>
          <label htmlFor="amaze-email">Email</label>
          <input
            id="amaze-email"
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Your email"
            data-testid="amaze-email-input"
          />
        </div>
        <div>
          <label htmlFor="amaze-feedback">Feedback</label>
          <textarea
            id="amaze-feedback"
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="Your feedback"
            data-testid="amaze-feedback-input"
          />
        </div>
        <button type="submit" data-testid="amaze-submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Page;
