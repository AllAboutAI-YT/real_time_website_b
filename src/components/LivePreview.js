import React, { useEffect, useRef } from 'react';

const LivePreview = ({ htmlCode, cssCode }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      const doc = iframe.contentDocument;
      doc.open();
      doc.write(`
        <html>
          <head>
            <style>
              body {
                background-color: white;
                color: black;
              }
              ${cssCode}
            </style>
          </head>
          <body>${htmlCode}</body>
        </html>
      `);
      doc.close();
    }
  }, [htmlCode, cssCode]);

  return (
    <div className="live-preview">
      <iframe ref={iframeRef} title="Live Preview" />
    </div>
  );
};

export default LivePreview;