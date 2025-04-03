import React from 'react';
import { renderCard } from '../../utils/cardUtils';

const CardPreview = React.forwardRef(({ cardData, cardDimensions, zoomLevel }, ref) => {
  return (
    <div className={`card-preview-container ${zoomLevel}`}>
      <div
        className="card-preview"
        ref={ref}
        dangerouslySetInnerHTML={{ __html: renderCard(cardData, cardDimensions) }}
      />
    </div>
  );
});

export default CardPreview;
