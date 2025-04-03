import React from 'react';
import ExportDropdown from '../Export/ExportDropdown';

const CardActions = ({ onExport, onCopy, clarity, setClarity }) => {
  return (
    <div className="card-actions">
      <ExportDropdown 
        onExport={onExport} 
        onCopy={onCopy}
        clarity={clarity}
        setClarity={setClarity}
      />
    </div>
  );
};

export default CardActions;
