import themes from '../config/themes';

/**
 * 计算卡片高度
 */
export const calculateCardHeight = (content, quote) => {
  const paragraphs = content.split('\n').filter(p => p.trim() !== '');
  const totalChars = content.length;
  const newLines = (content.match(/\n/g) || []).length;

  const charsPerLine = 40;
  const lineHeight = 20;
  const paragraphMargin = 20;

  // 计算内容所需高度
  let estimatedHeight = Math.ceil(totalChars / charsPerLine) * lineHeight 
                       + newLines * lineHeight 
                       + paragraphs.length * paragraphMargin;

  // 添加引言的高度
  const quoteLength = quote.length;
  const quoteHeight = Math.ceil(quoteLength / 30) * 20;

  // 确保最小高度为300px
  const contentHeight = Math.max(300, estimatedHeight);

  // 页眉页脚基础高度(约160px) + 较小的底部边距(20px)
  const totalHeight = contentHeight + 180;

  return {
    height: totalHeight,
    contentHeight: contentHeight
  };
};

/**
 * 渲染SVG卡片
 */
export const renderCard = (cardData, cardDimensions) => {
  const paragraphs = cardData.content.split('\n').filter(p => p.trim() !== '');
  const colors = themes[cardData.theme];

  const renderQuote = () => {
    return `
      <foreignObject x="180" y="130" width="520" height="50">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Microsoft YaHei', sans-serif; font-size: 16px; color: ${colors.primary}; overflow-wrap: break-word; white-space: normal;">
          ${cardData.quote}
        </div>
      </foreignObject>
    `;
  };

  const renderContent = () => {
    return `
      <foreignObject x="100" y="190" width="600" height="${cardDimensions.contentHeight}">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Microsoft YaHei', sans-serif; font-size: 14px; color: ${colors.text};">
          ${paragraphs.map((paragraph, index) =>
      `<p style="margin-bottom: 20px; text-indent: ${index === 0 ? '0' : '2em'};"><span style="font-weight: bold;">${index + 1}.</span> ${paragraph.trim()}</p>`
    ).join('')}
        </div>
      </foreignObject>
    `;
  };

  // 计算底部装饰和文本的位置
  const footerY = 190 + cardDimensions.contentHeight + 30;
  const decorY = footerY - 50;

  return `
    <svg width="800" height="${cardDimensions.height}" viewBox="0 0 800 ${cardDimensions.height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cardBackground" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.bgLight};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.bgDark};stop-opacity:1" />
        </linearGradient>
        <filter id="dropShadow">
          <feDropShadow dx="3" dy="3" stdDeviation="2" flood-opacity="0.2" flood-color="${colors.secondary}" />
        </filter>
        <pattern id="decorPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M20,10 C40,0 60,0 80,10 C60,20 40,20 20,10 Z" fill="${colors.secondary}" fill-opacity="0.1" transform="rotate(30 50 10)"/>
          <path d="M80,50 C90,30 90,10 80,0 C70,10 70,30 80,50 Z" fill="${colors.tertiary}" fill-opacity="0.1" transform="rotate(-20 80 25)"/>
          <path d="M10,80 C30,70 50,70 70,80 C50,90 30,90 10,80 Z" fill="${colors.light}" fill-opacity="0.1" transform="rotate(15 40 80)"/>
        </pattern>
      </defs>
      
      <rect x="50" y="50" width="700" height="${cardDimensions.height - 100}" rx="15" ry="15" fill="url(#cardBackground)" filter="url(#dropShadow)" />
      <rect x="50" y="50" width="700" height="${cardDimensions.height - 100}" rx="15" ry="15" fill="url(#decorPattern)" />
      
      <g transform="translate(80, 85)">
        <path d="M0,0 L10,-15 L0,-30 L-10,-15 Z M0,0 L15,-5 L30,0 L15,5 Z M0,0 L5,15 L0,30 L-5,15 Z M0,0 L-15,5 L-30,0 L-15,-5 Z" 
              fill="${colors.accent}" opacity="0.8" />
      </g>
      
      <text x="140" y="100" font-family="'Microsoft YaHei', sans-serif" font-size="26" font-weight="bold" fill="${colors.primary}">${cardData.title}</text>
      
      <line x1="100" y1="120" x2="700" y2="120" stroke="${colors.secondary}" stroke-width="2" stroke-opacity="0.7" />
      
      <text x="100" y="150" font-family="'Microsoft YaHei', sans-serif" font-size="18" font-weight="bold" fill="${colors.primary}">${cardData.author}</text>
      
      ${renderQuote()}
      
      ${renderContent()}
      
      <!-- 装饰元素：右下角 -->
      <g transform="translate(650, ${decorY})">
        <path d="M0,0 Q10,-10 0,-20 Q-10,-10 0,0 Z" fill="${colors.accent}" />
        <path d="M-15,-5 Q-5,-15 -15,-25 Q-25,-15 -15,-5 Z" fill="${colors.secondary}" />
        <path d="M15,-5 Q25,-15 15,-25 Q5,-15 15,-5 Z" fill="${colors.tertiary}" />
        <path d="M-10,15 Q0,5 -10,-5 Q-20,5 -10,15 Z" fill="${colors.secondary}" />
        <path d="M10,15 Q20,5 10,-5 Q0,5 10,15 Z" fill="${colors.accent}" />
        <line x1="0" y1="0" x2="0" y2="20" stroke="${colors.primary}" stroke-width="1" />
        <line x1="-15" y1="-5" x2="-5" y2="20" stroke="${colors.primary}" stroke-width="1" />
        <line x1="15" y1="-5" x2="5" y2="20" stroke="${colors.primary}" stroke-width="1" />
      </g>
      
      <!-- 底部署名 -->
      <text x="400" y="${footerY}" font-family="'Microsoft YaHei', sans-serif" font-size="14" fill="${colors.secondary}" text-anchor="middle">${cardData.footer}</text>
      
      <text x="650" y="80" font-family="'Microsoft YaHei', sans-serif" font-size="14" fill="${colors.secondary}" text-anchor="end">${cardData.date}</text>
    </svg>
  `;
};
