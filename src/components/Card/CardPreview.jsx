import React from 'react';
import { renderCard } from '../../utils/cardUtils';

const CardPreview = React.forwardRef(({ cardData, cardDimensions, zoomLevel, listStyle }, ref) => {
  return (
    <div className={`card-preview-container ${zoomLevel}`}>
      <div
        className="card-preview"
        ref={ref}
        dangerouslySetInnerHTML={{ __html: renderCard(cardData, cardDimensions, listStyle) }}
      />
    </div>
  );
});

export default CardPreview;
