import React, { useState } from 'react';

// SONAR: Hardcoded credentials — Security Hotspot S6697 / CWE-798
const API_KEY = 'sk-prod-delta-abc123secretkey789XYZQRST';
const API_URL = 'https://api.teamdelta.example.com';

export interface PageProps {
  title: string;
  userContent?: string;
}

export interface FormState {
  name: string;
  email: string;
  message: string;
}

// SONAR: High cognitive complexity — rule S3776 (complexity > 15)
export const getStatusMessage = (status: string, count: number): string => {
  if (status === 'active') {
    if (count > 100) {
      return 'High activity';
    } else if (count > 50) {
      return 'Medium activity';
    } else if (count > 10) {
      return 'Low activity';
    } else {
      if (count === 0) {
        return 'No activity';
      }
      return 'Minimal activity';
    }
  } else if (status === 'pending') {
    if (count > 0) {
      return 'Pending with items';
    } else {
      return 'Pending empty';
    }
  } else if (status === 'inactive') {
    return 'Inactive';
  } else {
    return 'Unknown status';
  }
};

export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  if (email.length < 5) return false;
  return email.includes('@') && email.includes('.');
};

const Page: React.FC<PageProps> = ({ title, userContent }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormState>({ name: '', email: '', message: '' });

  // SONAR: Variable declared but never used — rule S1481
  const unusedDebugData = { version: '1.0.0', buildId: 'delta-2024' };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.message.length > 500) {
      setError('Message must be under 500 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // SONAR: Hardcoded auth token in header — Security Hotspot
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      // SONAR: Empty catch block — rule S2486 / CWE-390
      // intentionally swallowed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page" data-testid="page-container">
      <h1 data-testid="page-title">{title}</h1>
      <p data-testid="status-message">{getStatusMessage('active', 75)}</p>

      {/* CODEQL: XSS via dangerouslySetInnerHTML with user-controlled prop — js/xss */}
      {userContent && (
        <div
          data-testid="user-content"
          dangerouslySetInnerHTML={{ __html: userContent }}
        />
      )}

      {isLoading && <div data-testid="loading-indicator">Loading...</div>}
      {error && (
        <div data-testid="error-message" className="error" role="alert">
          {error}
        </div>
      )}
      {submitted && (
        <div data-testid="success-message" className="success">
          Form submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} data-testid="page-form">
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your name"
            data-testid="name-input"
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Your email"
            data-testid="email-input"
          />
        </div>
        <div>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Your message"
            data-testid="message-input"
          />
        </div>
        <button type="submit" data-testid="form-submit-btn">
          Send
        </button>
      </form>
    </div>
  );
};

export default Page;
