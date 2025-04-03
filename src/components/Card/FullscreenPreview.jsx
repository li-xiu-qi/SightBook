import React from 'react';
import { renderCard } from '../../utils/cardUtils';
import PreviewControls from '../Controls/PreviewControls';

const FullscreenPreview = ({ 
  cardData, 
  cardDimensions, 
  zoomLevel, 
  onClose, 
  onZoomIn, 
  onZoomOut, 
  onZoomReset 
}) => {
  return (
    <div className="fullscreen-mode">
      <button className="fullscreen-close" onClick={onClose}>&times;</button>
      <PreviewControls 
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onZoomReset={onZoomReset}
      />
      <div
        className={`card-preview ${zoomLevel}`}
        dangerouslySetInnerHTML={{ __html: renderCard(cardData, cardDimensions) }}
      />
    </div>
  );
};

export default FullscreenPreview;
