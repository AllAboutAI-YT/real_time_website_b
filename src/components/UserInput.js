import React from 'react';

const UserInput = ({ value, onChange, isStreaming }) => {
  return (
    <div className="user-input" style={{ height: '100%' }}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe the website you want to create..."
        disabled={isStreaming}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
          border: '1px solid #333333',
          borderRadius: '4px',
          padding: '15px',
          fontSize: '18px',
          lineHeight: '1.5',
          resize: 'none',
        }}
      />
      {isStreaming && <p style={{ color: '#03dac6', marginTop: '10px', fontSize: '16px' }}>Streaming in progress...</p>}
    </div>
  );
};

export default UserInput;