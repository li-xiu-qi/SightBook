import React from 'react';

const ClaritySelector = ({ clarity, setClarity }) => {
  return (
    <div className="clarity-selector">
      <label htmlFor="clarity-select">导出清晰度：</label>
      <select 
        id="clarity-select" 
        value={clarity} 
        onChange={(e) => setClarity(parseFloat(e.target.value))}
        className="clarity-select"
      >
        <option value="1">标准 (1x)</option>
        <option value="2">高清 (2x)</option>
        <option value="4">超清 (4x)</option>
      </select>
    </div>
  );
};

export default ClaritySelector;
