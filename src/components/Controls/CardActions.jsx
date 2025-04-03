import React from 'react';
import ExportDropdown from '../Export/ExportDropdown';

const CardActions = ({ onGenerate, onExport, onCopy }) => {
  return (
    <div className="card-actions">
      <button className="primary-btn" onClick={onGenerate}>生成卡片</button>
      <ExportDropdown onExport={onExport} onCopy={onCopy} />
    </div>
  );
};

export default CardActions;
