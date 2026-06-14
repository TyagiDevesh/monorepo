import React from 'react';
import Page from './components/Page/Page';
import SubmitButton from './components/SubmitButton/SubmitButton';

const App: React.FC = () => {
  const handleSubmit = () => {
    console.log('TeamAmaze submission triggered');
  };

  return (
    <div style={{ fontFamily: 'Georgia, serif', maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <header style={{ borderBottom: '2px solid #e03e2d', paddingBottom: 16, marginBottom: 24 }}>
        <h1 style={{ color: '#e03e2d', margin: 0 }}>TeamAmaze</h1>
        <p style={{ color: '#555', margin: '4px 0 0' }}>Quality Automation — Amaze Team Portal</p>
      </header>

      <Page title="Amaze Team Dashboard" />

      <div style={{ marginTop: 24 }}>
        <SubmitButton label="Submit Entry" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default App;
