import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// 导入主题配置
const themes = {
  autumn: {
    primary: '#774936',
    secondary: '#cb997e',
    tertiary: '#ddbea9',
    accent: '#e07a5f',
    text: '#6b705c',
    bgLight: '#fff8f0',
    bgDark: '#fff1e6',
    light: '#ffe8d6'
  },
  winter: {
    primary: '#2c3e50',
    secondary: '#7f8c8d',
    tertiary: '#bdc3c7',
    accent: '#3498db',
    text: '#34495e',
    bgLight: '#ecf0f1',
    bgDark: '#e0e6e8',
    light: '#f5f7fa'
  },
  spring: {
    primary: '#2d6a4f',
    secondary: '#40916c',
    tertiary: '#74c69d',
    accent: '#95d5b2',
    text: '#1b4332',
    bgLight: '#f1faee',
    bgDark: '#e9f5db',
    light: '#d8f3dc'
  },
  summer: {
    primary: '#e76f51',
    secondary: '#f4a261',
    tertiary: '#e9c46a',
    accent: '#2a9d8f',
    text: '#264653',
    bgLight: '#fffdeb',
    bgDark: '#fef3de',
    light: '#fff8e8'
  }
};

function App() {
  // 卡片内容状态
  const [cardData, setCardData] = useState({
    title: '#今日份阅读',
    author: '达利欧：',
    quote: '不要固守你对事物"应该"是什么样的看法，这将使你无法了解真实的情况。',
    content: `学着做到极度透明，就像学习如何公开发言一样：一开始你会难堪，但你练得越多，你就越能应付自如。

公开展示我的个人情况，这会引人注意，也会招致批评。但我还是这么做了，因为我知道这样做是最好的，而如果我让恐惧阻碍自己，我将对自己不满意。

如果人们不是隐藏看法，而是公开分享看法，这将减少多少误解，世界的运转将会变得多么高效，我们将会多么接近真相。

极度探寻真相、极度透明，如何大大改善了我的决策和人际关系。所以每当我面对抉择时，我的直觉都是保持透明。`,
    footer: '秋日思绪，温暖心灵',
    date: '2023年·秋',
    theme: 'autumn'
  });

  // UI状态
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState('normal');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 创建导出任务跟踪系统
  const [exportTasks, setExportTasks] = useState([]);
  const exportContainerRef = useRef(null);

  // 添加卡片尺寸状态
  const [cardDimensions, setCardDimensions] = useState({
    height: 600,
    contentHeight: 300
  });

  // 引用SVG内容
  const cardPreviewRef = useRef(null);
  const exportDropdownRef = useRef(null);

  // 在内容变化时重新计算高度
  useEffect(() => {
    calculateCardHeight();
  }, [cardData.content, cardData.quote]);

  // 自动滚动到最新的任务
  useEffect(() => {
    if (exportContainerRef.current && exportTasks.length > 0) {
      exportContainerRef.current.scrollTop = exportContainerRef.current.scrollHeight;
    }
  }, [exportTasks]);

  // 计算卡片所需高度的函数
  const calculateCardHeight = () => {
    const paragraphs = cardData.content.split('\n').filter(p => p.trim() !== '');
    const totalChars = cardData.content.length;
    const newLines = (cardData.content.match(/\n/g) || []).length;

    const charsPerLine = 40;
    const lineHeight = 20;
    const paragraphMargin = 20;

    // 计算内容所需高度
    let estimatedHeight = Math.ceil(totalChars / charsPerLine) * lineHeight + newLines * lineHeight + paragraphs.length * paragraphMargin;

    // 添加引言的高度
    const quoteLength = cardData.quote.length;
    const quoteHeight = Math.ceil(quoteLength / 30) * 20;

    // 确保最小高度为300px
    const contentHeight = Math.max(300, estimatedHeight);

    // 减少固定的底部间距：从之前的290px减少到180px
    // 页眉页脚基础高度(约160px) + 较小的底部边距(20px)
    const totalHeight = contentHeight + 180;

    setCardDimensions({
      height: totalHeight,
      contentHeight: contentHeight
    });
  };

  // 关闭导出下拉菜单的点击外部事件
  useEffect(() => {
    function handleClickOutside(event) {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 添加新的导出任务
  const addExportTask = (format, message = '') => {
    const id = Date.now(); // 使用时间戳作为唯一ID

    setExportTasks(prev => [
      ...prev,
      {
        id,
        format,
        progress: 0,
        status: 'pending',
        message,
        startTime: Date.now()
      }
    ]);

    return id; // 返回任务ID以供后续更新
  };

  // 更新导出任务进度
  const updateExportTask = (id, updates) => {
    setExportTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  // 完成导出任务
  const completeExportTask = (id, success, message = '') => {
    updateExportTask(id, {
      progress: 100,
      status: success ? 'success' : 'error',
      message,
      endTime: Date.now()
    });

    // 3秒后移除已完成的任务
    setTimeout(() => {
      setExportTasks(prev => prev.filter(task => task.id !== id));
    }, 3000);
  };

  // 处理表单字段变化
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setCardData(prev => ({ ...prev, [id]: value }));
  };

  // 生成卡片
  const generateCard = () => {
    calculateCardHeight();
  };

  // 显示导出操作的结果消息（保留向后兼容）

  // 下载卡片函数 - 使用任务进度系统
  const downloadCard = async (format = 'svg') => {
    const taskId = addExportTask(format, `正在导出${format.toUpperCase()}...`);

    try {
      if (!cardPreviewRef.current) {
        throw new Error('未找到SVG元素，请先生成卡片');
      }

      // 获取SVG元素
      const svgElement = cardPreviewRef.current.querySelector('svg');
      if (!svgElement) {
        throw new Error('未找到SVG元素，请重新生成卡片');
      }

      updateExportTask(taskId, { progress: 10, message: '正在准备SVG数据...' });

      // 克隆SVG元素以避免修改原始DOM
      const clonedSvg = svgElement.cloneNode(true);

      // 为了确保正确渲染，设置一些必要的属性
      clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      clonedSvg.setAttribute('width', '800px');
      clonedSvg.setAttribute('height', `${cardDimensions.height}px`);

      updateExportTask(taskId, { progress: 20, message: '正在序列化SVG...' });

      // 获取SVG的XML字符串
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(clonedSvg);

      // 添加XML声明
      const svgData = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + svgString;

      updateExportTask(taskId, { progress: 40, message: '正在处理导出格式...' });

      if (format === 'svg') {
        // 导出SVG
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
        const svgUrl = URL.createObjectURL(svgBlob);

        updateExportTask(taskId, { progress: 60, message: '准备下载...' });

        const downloadLink = document.createElement('a');
        downloadLink.href = svgUrl;
        downloadLink.download = '阅读卡片.svg';
        document.body.appendChild(downloadLink);

        updateExportTask(taskId, { progress: 80, message: '开始下载...' });
        downloadLink.click();
        document.body.removeChild(downloadLink);

        URL.revokeObjectURL(svgUrl);
        completeExportTask(taskId, true, 'SVG卡片已成功下载');
      } else if (format === 'png' || format === 'jpg') {
        // 修复的PNG/JPG导出方法
        updateExportTask(taskId, { progress: 45, message: '正在编码SVG...' });
        const base64SVG = btoa(unescape(encodeURIComponent(svgData)));
        const imgSrc = `data:image/svg+xml;base64,${base64SVG}`;

        updateExportTask(taskId, { progress: 50, message: '创建画布...' });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = 800;
        canvas.height = cardDimensions.height;

        const img = new Image();
        img.crossOrigin = 'anonymous';  // 避免跨域问题

        // 监听图像加载
        img.onload = () => {
          updateExportTask(taskId, { progress: 60, message: '绘制图像...' });
          // 填充白色背景
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // 在画布上绘制SVG
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          try {
            updateExportTask(taskId, { progress: 70, message: '转换格式...' });
            // 选择适当的MIME类型和质量
            const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
            const quality = format === 'jpg' ? 0.9 : undefined;

            // 使用canvas.toBlob转换为文件
            canvas.toBlob(
              (blob) => {
                updateExportTask(taskId, { progress: 80, message: '准备下载...' });
                if (blob) {
                  // 创建下载链接
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `阅读卡片.${format}`;
                  document.body.appendChild(a);
                  updateExportTask(taskId, { progress: 90, message: '开始下载...' });
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);

                  completeExportTask(taskId, true, `${format.toUpperCase()}卡片已成功下载`);
                } else {
                  throw new Error(`无法生成${format.toUpperCase()}文件`);
                }
              },
              mimeType,
              quality
            );
          } catch (err) {
            console.error("Canvas转换出错:", err);
            updateExportTask(taskId, { progress: 70, message: '尝试备用方法...' });

            // 回退方法：尝试使用canvas.toDataURL
            try {
              const dataUrl = canvas.toDataURL(format === 'png' ? 'image/png' : 'image/jpeg', format === 'jpg' ? 0.9 : undefined);
              updateExportTask(taskId, { progress: 85, message: '准备下载...' });
              const a = document.createElement('a');
              a.href = dataUrl;
              a.download = `阅读卡片.${format}`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);

              completeExportTask(taskId, true, `${format.toUpperCase()}卡片已下载（备用方法）`);
            } catch (backupErr) {
              console.error("回退导出方法失败:", backupErr);
              completeExportTask(taskId, false, `导出${format.toUpperCase()}失败`);
            }
          }
        };

        // 图像加载错误处理
        img.onerror = (err) => {
          console.error("图像加载失败:", err);
          completeExportTask(taskId, false, `无法加载图像，导出失败`);
        };

        updateExportTask(taskId, { progress: 55, message: '加载图像...' });
        // 设置图像源
        img.src = imgSrc;
      }
    } catch (error) {
      console.error('导出错误:', error);
      completeExportTask(taskId, false, `导出失败: ${error.message}`);
    }
  };

  // 复制到剪贴板 - 使用任务进度系统
  const copyToClipboard = async () => {
    const taskId = addExportTask('clipboard', '正在准备复制到剪贴板...');

    try {
      if (!cardPreviewRef.current) {
        throw new Error('未找到SVG元素');
      }

      updateExportTask(taskId, { progress: 20, message: '获取SVG元素...' });

      // 获取SVG元素
      const svgElement = cardPreviewRef.current.querySelector('svg');
      if (!svgElement) {
        throw new Error('未找到SVG元素，请重新生成卡片');
      }

      // 克隆SVG元素以避免修改原始DOM
      const clonedSvg = svgElement.cloneNode(true);

      updateExportTask(taskId, { progress: 40, message: '处理SVG数据...' });

      // 设置必要的属性
      clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

      // 获取SVG字符串
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(clonedSvg);

      updateExportTask(taskId, { progress: 60, message: '尝试复制SVG...' });

      // 尝试方法1：直接复制SVG
      if (navigator.clipboard && window.ClipboardItem) {
        try {
          const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/svg+xml': svgBlob })
          ]);
          completeExportTask(taskId, true, '卡片已复制到剪贴板');
          return;
        } catch (e) {
          console.warn('SVG复制到剪贴板失败，尝试PNG方法', e);
          updateExportTask(taskId, { progress: 65, message: '尝试PNG方法...' });
        }
      }

      // 尝试方法2：转换为PNG再复制
      try {
        updateExportTask(taskId, { progress: 70, message: '转换为PNG...' });
        // 将SVG转换为Base64编码的数据URL
        const base64SVG = btoa(unescape(encodeURIComponent(svgString)));
        const imgSrc = `data:image/svg+xml;base64,${base64SVG}`;

        // 创建Canvas
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = cardDimensions.height;
        const ctx = canvas.getContext('2d');

        // 创建图像元素
        const img = new Image();
        img.crossOrigin = 'anonymous';

        // 定义图像加载后的操作
        img.onload = async () => {
          updateExportTask(taskId, { progress: 80, message: '准备图像数据...' });
          // 绘制白色背景
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // 绘制SVG图像
          ctx.drawImage(img, 0, 0);

          updateExportTask(taskId, { progress: 90, message: '复制到剪贴板...' });

          try {
            // 将Canvas转换为Blob
            const blob = await new Promise((resolve, reject) => {
              canvas.toBlob(resolve, 'image/png');
            });

            if (!blob) {
              throw new Error('无法创建PNG图像');
            }

            // 复制PNG到剪贴板
            if (navigator.clipboard && navigator.clipboard.write) {
              await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
              ]);
              completeExportTask(taskId, true, '卡片已复制到剪贴板（PNG格式）');
            } else {
              throw new Error('浏览器不支持复制图像到剪贴板');
            }
          } catch (err) {
            console.error('PNG复制失败:', err);
            updateExportTask(taskId, { progress: 95, message: '尝试文本复制...' });

            // 尝试方法3：文本回退方案
            if (navigator.clipboard && navigator.clipboard.writeText) {
              try {
                await navigator.clipboard.writeText('阅读卡片内容无法以图像形式复制，请使用下载功能保存卡片。');
                completeExportTask(taskId, true, '已复制提示文本');
              } catch (textErr) {
                completeExportTask(taskId, false, '复制失败，请使用下载功能');
              }
            }
          }
        };

        // 图像加载失败的处理
        img.onerror = () => {
          console.error('SVG图像加载失败');
          completeExportTask(taskId, false, '复制失败，请使用下载功能');
        };

        // 开始加载图像
        img.src = imgSrc;
      } catch (error) {
        console.error('复制图像处理失败:', error);
        completeExportTask(taskId, false, '复制失败，请使用下载功能');
      }
    } catch (error) {
      console.error('复制流程错误:', error);
      completeExportTask(taskId, false, `复制失败: ${error.message}`);
    }
  };

  // 渲染SVG卡片 - 修复缺失的pattern定义
  const renderCard = () => {
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

    // 计算底部装饰和文本的位置 - 现在使用固定间距而不是固定位置
    const footerY = 190 + cardDimensions.contentHeight + 30; // 内容起始Y(190) + 内容高度 + 底部间距(30px)

    // 装饰元素位置
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
        
        <!-- 装饰元素：右下角 - 固定在内容之后 -->
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
        
        <!-- 底部署名 - 固定在内容之后 -->
        <text x="400" y="${footerY}" font-family="'Microsoft YaHei', sans-serif" font-size="14" fill="${colors.secondary}" text-anchor="middle">${cardData.footer}</text>
        
        <text x="650" y="80" font-family="'Microsoft YaHei', sans-serif" font-size="14" fill="${colors.secondary}" text-anchor="end">${cardData.date}</text>
      </svg>
    `;
  };

  // 导出任务显示组件
  const ExportTasksList = () => {
    if (exportTasks.length === 0) return null;

    return (
      <div className="export-tasks-container" ref={exportContainerRef}>
        {exportTasks.map(task => (
          <div
            key={task.id}
            className={`export-task ${task.status !== 'pending' ? task.status : ''}`}
          >
            <div className="export-task-info">
              <span className="export-task-format">
                {task.format === 'clipboard' ? '剪贴板' :
                  task.format === 'notification' ? '通知' :
                    task.format.toUpperCase()}
              </span>
              <span className="export-task-message">{task.message}</span>
            </div>
            <div className="export-progress-bar">
              <div
                className="export-progress-fill"
                style={{ width: `${task.progress}%` }}
              ></div>
              <span className="export-progress-text">{`${task.progress}%`}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="app-container">
      <header>
        <h1>阅读卡片生成器</h1>
        <p>输入您的文字，生成精美的阅读卡片</p>
      </header>

      <main>
        <div className="input-section">
          <h2>输入内容</h2>
          <form>
            <div className="form-group">
              <label htmlFor="title">卡片标题</label>
              <input
                id="title"
                type="text"
                value={cardData.title}
                onChange={handleInputChange}
                placeholder="例如: #今日份阅读"
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">作者名称</label>
              <input
                id="author"
                type="text"
                value={cardData.author}
                onChange={handleInputChange}
                placeholder="例如: 达利欧："
              />
            </div>

            <div className="form-group">
              <label htmlFor="quote">引言/摘要</label>
              <textarea
                id="quote"
                value={cardData.quote}
                onChange={handleInputChange}
                placeholder="作者的主要观点或引言"
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">正文内容</label>
              <textarea
                id="content"
                rows={10}
                value={cardData.content}
                onChange={handleInputChange}
                placeholder="输入主要内容，每段将自动生成序号"
              />
            </div>

            <div className="form-group">
              <label htmlFor="footer">底部署名</label>
              <input
                id="footer"
                type="text"
                value={cardData.footer}
                onChange={handleInputChange}
                placeholder="例如: 秋日思绪，温暖心灵"
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">右上角日期</label>
              <input
                id="date"
                type="text"
                value={cardData.date}
                onChange={handleInputChange}
                placeholder="例如: 2023年·秋"
              />
            </div>

            <div className="form-group">
              <label htmlFor="theme">卡片主题</label>
              <select
                id="theme"
                value={cardData.theme}
                onChange={handleInputChange}
              >
                <option value="autumn">秋季主题</option>
                <option value="winter">冬季主题</option>
                <option value="spring">春季主题</option>
                <option value="summer">夏季主题</option>
              </select>
            </div>
          </form>
        </div>

        <div className="preview-section">
          <h2>卡片预览</h2>
          <div className="card-actions">
            <button className="primary-btn" onClick={generateCard}>生成卡片</button>
            <div className="dropdown" ref={exportDropdownRef}>
              <button
                className="export-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                导出卡片 <i className={dropdownOpen ? 'rotate' : ''}>{'\u25BC'}</i>
              </button>
              <div className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}>
                <button onClick={() => { downloadCard('svg'); setDropdownOpen(false); }}>SVG格式</button>
                <button onClick={() => { downloadCard('png'); setDropdownOpen(false); }}>PNG格式</button>
                <button onClick={() => { downloadCard('jpg'); setDropdownOpen(false); }}>JPG格式</button>
                <button onClick={() => { copyToClipboard(); setDropdownOpen(false); }}>复制到剪贴板</button>
              </div>
            </div>
          </div>

          <div className="preview-controls">
            <button
              title="放大预览"
              onClick={() => setZoomLevel('zoom-in')}
            >
              放大
            </button>
            <button
              title="缩小预览"
              onClick={() => setZoomLevel('zoom-out')}
            >
              缩小
            </button>
            <button
              title="适应屏幕"
              onClick={() => setZoomLevel('normal')}
            >
              适应屏幕
            </button>
            <button
              title="全屏预览"
              onClick={() => setIsFullscreen(true)}
            >
              全屏预览
            </button>
          </div>

          <div className={`card-preview-container ${zoomLevel}`}>
            <div
              id="cardPreview"
              className="card-preview"
              ref={cardPreviewRef}
              dangerouslySetInnerHTML={{ __html: renderCard() }}
            />
          </div>
        </div>
      </main>

      {isFullscreen && (
        <div className="fullscreen-mode">
          <button className="fullscreen-close" onClick={() => setIsFullscreen(false)}>&times;</button>
          <div className="preview-controls">
            <button onClick={() => setZoomLevel('zoom-in')}>放大</button>
            <button onClick={() => setZoomLevel('zoom-out')}>缩小</button>
            <button onClick={() => setZoomLevel('normal')}>适应屏幕</button>
          </div>
          <div
            className={`card-preview ${zoomLevel}`}
            dangerouslySetInnerHTML={{ __html: renderCard() }}
          />
        </div>
      )}

      {/* 导出任务列表显示 */}
      <ExportTasksList />

      <footer>
        <p>SightBook 阅读卡片生成器 &copy; 2023</p>
      </footer>
    </div>
  );
}

export default App;
