import React from 'react';
import CardActions from '../Controls/CardActions';
import PreviewControls from '../Controls/PreviewControls';
import CardPreview from './CardPreview';
import ThemeSelector from '../Controls/ThemeSelector';

const PreviewSection = ({
  cardData,
  cardDimensions,
  zoomLevel,
  cardPreviewRef,
  onExport,
  onCopy,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onFullscreen,
  onThemeChange,
  clarity,
  setClarity
}) => {
  return (
    <div className="preview-section">
      <h2>卡片预览</h2>
      
      <ThemeSelector 
        currentTheme={cardData.theme} 
        onThemeChange={onThemeChange} 
      />
      
      <CardActions 
        onExport={onExport}
        onCopy={onCopy}
        clarity={clarity}
        setClarity={setClarity}
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
