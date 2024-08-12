import React, { useEffect, useRef } from 'react';

const StreamingLivePreview = ({ htmlCode, cssCode }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      const doc = iframe.contentDocument;
      
      // Update HTML
      const bodyContent = htmlCode || '<h1 style="color: #ffffff; text-align: center; font-family: Arial, sans-serif;">Your website will appear here</h1>';
      if (doc.body.innerHTML !== bodyContent) {
        doc.body.innerHTML = bodyContent;
      }
      
      // Update CSS
      let style = doc.getElementById('dynamic-style');
      if (!style) {
        style = doc.createElement('style');
        style.id = 'dynamic-style';
        doc.head.appendChild(style);
      }
      const cssContent = `
        body {
          background-color: #2a2a2a;
          color: #ffffff;
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          box-sizing: border-box;
          overflow: auto;
          height: 100%;
        }
        ${cssCode || ''}
      `;
      if (style.textContent !== cssContent) {
        style.textContent = cssContent;
      }
    }
  }, [htmlCode, cssCode]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      const doc = iframe.contentDocument;
      doc.open();
      doc.write('<html><head><style id="dynamic-style"></style></head><body></body></html>');
      doc.close();
    }
  }, []); // This effect runs only once on mount

  return (
    <div className="streaming-live-preview" style={{ height: '100%' }}>
      <iframe 
        ref={iframeRef} 
        title="Streaming Live Preview"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#2a2a2a',
          border: '1px solid #333333',
          borderRadius: '4px',
        }}
      />
    </div>
  );
};

export default StreamingLivePreview;