import React from 'react';

const HtmlInput = ({ value, onChange }) => {
  return (
    <div className="html-input">
      <h3>HTML Code</h3>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your HTML code here..."
      />
    </div>
  );
};

export default HtmlInput;