import themes from '../config/themes';

/**
 * 计算卡片高度
 */
export const calculateCardHeight = (content, quote) => {
  // 基于内容长度计算所需的行数
  const paragraphs = content.split('\n').filter(p => p.trim() !== '');
  const totalChars = content.length;
  
  // 每行预计字符数和行高
  const charsPerLine = 42; // 每行平均字符数
  const lineHeight = 25; // 行高
  const paragraphGap = 15; // 段落间距
  
  // 计算每段需要的行数和总行数
  let totalLines = 0;
  paragraphs.forEach(para => {
    // 每段至少1行，向上取整确保足够空间
    const linesInPara = Math.ceil(para.length / charsPerLine);
    totalLines += linesInPara;
  });
  
  // 计算内容区域高度 (行数 * 行高 + 段落间距)
  const contentHeight = totalLines * lineHeight + (paragraphs.length - 1) * paragraphGap;
  
  // 确保内容区域最小高度
  const minContentHeight = 200;
  const actualContentHeight = Math.max(minContentHeight, contentHeight);
  
  // 卡片总高度 = 页眉(150px) + 内容高度 + 页脚(100px)
  const totalHeight = 150 + actualContentHeight + 100;
  
  return {
    height: totalHeight,
    contentHeight: actualContentHeight
  };
};

/**
 * 渲染SVG卡片
 */
export const renderCard = (cardData, cardDimensions) => {
  const paragraphs = cardData.content.split('\n').filter(p => p.trim() !== '');
  const colors = themes[cardData.theme];
  
  // 生成唯一ID，防止多个SVG之间的ID冲突
  const uniqueId = `card-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const gradientId = `cardBackground-${uniqueId}`;
  const shadowId = `dropShadow-${uniqueId}`;
  const patternId = `decorPattern-${uniqueId}`;
  
  // 计算内容区域的起始位置和高度
  const contentStartY = 190;
  const contentHeight = cardDimensions.contentHeight;
  
  // 渲染内容段落
  const renderParagraphs = () => {
    let y = contentStartY;
    const lines = [];
    
    paragraphs.forEach((paragraph, index) => {
      // 每段的第一行带序号
      lines.push(`<text x="100" y="${y}" font-family="'Microsoft YaHei', sans-serif" font-size="14" fill="${colors.text}">
        <tspan font-weight="bold">${index + 1}.</tspan> ${paragraph.slice(0, 42)}
      </text>`);
      
      // 剩余的文本按每行约42个字符换行
      let remainingText = paragraph.slice(42);
      while (remainingText.length > 0) {
        y += 25; // 行高
        const lineText = remainingText.slice(0, 42);
        remainingText = remainingText.slice(42);
        lines.push(`<text x="120" y="${y}" font-family="'Microsoft YaHei', sans-serif" font-size="14" fill="${colors.text}">${lineText}</text>`);
      }
      
      y += 40; // 段落间距
    });
    
    return lines.join('\n');
  };

  return `
    <svg width="800" height="${cardDimensions.height}" viewBox="0 0 800 ${cardDimensions.height}" xmlns="http://www.w3.org/2000/svg" version="1.1" xml:space="preserve">
      <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.bgLight};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.bgDark};stop-opacity:1" />
        </linearGradient>
        
        <filter id="${shadowId}">
          <feDropShadow dx="3" dy="3" stdDeviation="2" flood-opacity="0.2" flood-color="${colors.secondary}" />
        </filter>
        
        <pattern id="${patternId}" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M20,10 C40,0 60,0 80,10 C60,20 40,20 20,10 Z" fill="${colors.secondary}" fill-opacity="0.1" transform="rotate(30 50 10)"/>
          <path d="M80,50 C90,30 90,10 80,0 C70,10 70,30 80,50 Z" fill="${colors.tertiary}" fill-opacity="0.1" transform="rotate(-20 80 25)"/>
          <path d="M10,80 C30,70 50,70 70,80 C50,90 30,90 10,80 Z" fill="${colors.light}" fill-opacity="0.1" transform="rotate(15 40 80)"/>
        </pattern>
      </defs>
      
      <!-- 卡片背景 -->
      <rect x="50" y="50" width="700" height="${cardDimensions.height - 100}" rx="15" ry="15" fill="url(#${gradientId})" filter="url(#${shadowId})" />
      <rect x="50" y="50" width="700" height="${cardDimensions.height - 100}" rx="15" ry="15" fill="url(#${patternId})" />
      
      <!-- 顶部装饰 -->
      <g transform="translate(80, 85)">
        <path d="M0,0 L10,-15 L0,-30 L-10,-15 Z M0,0 L15,-5 L30,0 L15,5 Z M0,0 L5,15 L0,30 L-5,15 Z M0,0 L-15,5 L-30,0 L-15,-5 Z" 
              fill="${colors.accent}" opacity="0.8" />
      </g>
      
      <!-- 标题 -->
      <text x="140" y="100" font-family="'Microsoft YaHei', sans-serif" font-size="26" font-weight="bold" fill="${colors.primary}">${cardData.title}</text>
      
      <!-- 分隔线 -->
      <line x1="100" y1="120" x2="700" y2="120" stroke="${colors.secondary}" stroke-width="2" stroke-opacity="0.7" />
      
      <!-- 作者和引言 -->
      <text x="100" y="150" font-family="'Microsoft YaHei', sans-serif" font-size="18" font-weight="bold" fill="${colors.primary}">${cardData.author}</text>
      <text x="180" y="150" font-family="'Microsoft YaHei', sans-serif" font-size="16" fill="${colors.primary}">${cardData.quote}</text>
      
      <!-- 正文内容 -->
      <g font-family="'Microsoft YaHei', sans-serif" font-size="14" fill="${colors.text}">
        ${renderParagraphs()}
      </g>
      
      <!-- 右下角装饰 -->
      <g transform="translate(650, ${cardDimensions.height - 130})">
        <path d="M0,0 Q10,-10 0,-20 Q-10,-10 0,0 Z" fill="${colors.accent}" />
        <path d="M-15,-5 Q-5,-15 -15,-25 Q-25,-15 -15,-5 Z" fill="${colors.secondary}" />
        <path d="M15,-5 Q25,-15 15,-25 Q5,-15 15,-5 Z" fill="${colors.tertiary}" />
        <path d="M-10,15 Q0,5 -10,-5 Q-20,5 -10,15 Z" fill="${colors.secondary}" />
        <path d="M10,15 Q20,5 10,-5 Q0,5 10,15 Z" fill="${colors.accent}" />
        <line x1="0" y1="0" x2="0" y2="20" stroke="${colors.primary}" stroke-width="1" />
        <line x1="-15" y1="-5" x2="-5" y2="20" stroke="${colors.primary}" stroke-width="1" />
        <line x1="15" y1="-5" x2="5" y2="20" stroke="${colors.primary}" stroke-width="1" />
      </g>
      
      <!-- 底部装饰线 -->
      <line x1="200" y1="${cardDimensions.height - 80}" x2="600" y2="${cardDimensions.height - 80}" stroke="${colors.tertiary}" stroke-width="1" stroke-opacity="0.7" />
      
      <!-- 底部署名 -->
      <text x="400" y="${cardDimensions.height - 60}" font-family="'Microsoft YaHei', sans-serif" font-size="16" font-weight="500" fill="${colors.secondary}" text-anchor="middle">${cardData.footer}</text>
      
      <!-- 右上角日期 -->
      <text x="650" y="80" font-family="'Microsoft YaHei', sans-serif" font-size="14" fill="${colors.secondary}" text-anchor="end">${cardData.date}</text>
    </svg>
  `;
};
