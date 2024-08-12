import React from 'react';
import LiveRenderer from './components/LiveRenderer';
import './styles/LiveRenderer.css';

function App() {
  return (
    <div className="App" style={{ height: '100vh', overflow: 'hidden' }}>
      <h1 style={{ margin: '10px 0', padding: '0 10px' }}>Real Time Website Builder</h1>
      <LiveRenderer />
    </div>
  );
}

export default App;