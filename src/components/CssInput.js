import React from 'react';

const CssInput = ({ value, onChange }) => {
  return (
    <div className="css-input">
      <h3>CSS Code</h3>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your CSS code here..."
      />
    </div>
  );
};

export default CssInput;