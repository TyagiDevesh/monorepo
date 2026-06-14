import React from 'react';
import Page from './components/Page/Page';
import SubmitButton from './components/SubmitButton/SubmitButton';

const App: React.FC = () => {
  const handleGlobalSubmit = () => {
    console.log('Global submit triggered from App');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <header style={{ borderBottom: '2px solid #1a73e8', paddingBottom: 16, marginBottom: 24 }}>
        <h1 style={{ color: '#1a73e8', margin: 0 }}>TeamDelta</h1>
        <p style={{ color: '#666', margin: '4px 0 0' }}>Quality Automation — Delta Team Portal</p>
      </header>

      <Page
        title="Delta Team Dashboard"
        userContent="<strong>Welcome to TeamDelta!</strong> Submit your report below."
      />

      <div style={{ marginTop: 24 }}>
        <SubmitButton label="Submit Report" onClick={handleGlobalSubmit} />
      </div>
    </div>
  );
};

export default App;
