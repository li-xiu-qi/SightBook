import React from 'react';

const PreviewControls = ({ onZoomIn, onZoomOut, onZoomReset, onFullscreen }) => {
  return (
    <div className="preview-controls">
      <button
        title="放大预览"
        onClick={onZoomIn}
      >
        放大
      </button>
      <button
        title="缩小预览"
        onClick={onZoomOut}
      >
        缩小
      </button>
      <button
        title="适应屏幕"
        onClick={onZoomReset}
      >
        适应屏幕
      </button>
      <button
        title="全屏预览"
        onClick={onFullscreen}
      >
        全屏预览
      </button>
    </div>
  );
};

export default PreviewControls;
