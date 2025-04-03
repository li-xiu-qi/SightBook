import React from 'react';
import CardActions from '../Controls/CardActions';
import PreviewControls from '../Controls/PreviewControls';
import CardPreview from './CardPreview';

const PreviewSection = ({
  cardData,
  cardDimensions,
  zoomLevel,
  cardPreviewRef,
  onGenerate,
  onExport,
  onCopy,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onFullscreen
}) => {
  return (
    <div className="preview-section">
      <h2>卡片预览</h2>
      
      <CardActions 
        onGenerate={onGenerate}
        onExport={onExport}
        onCopy={onCopy}
      />
      
      <PreviewControls 
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onZoomReset={onZoomReset}
        onFullscreen={onFullscreen}
      />
      
      <CardPreview
        cardData={cardData}
        cardDimensions={cardDimensions}
        zoomLevel={zoomLevel}
        ref={cardPreviewRef}
      />
    </div>
  );
};

export default PreviewSection;
