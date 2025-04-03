import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// 导入组件
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import InputSection from './components/Form/InputSection';
import PreviewSection from './components/Card/PreviewSection';
import FullscreenPreview from './components/Card/FullscreenPreview';
import ExportTasksList from './components/Export/ExportTasksList';

// 导入工具函数和配置
import { calculateCardHeight } from './utils/cardUtils';
import { svgToBlob, svgToCanvas, downloadFile } from './utils/exportUtils';

// 获取当前日期格式化函数
const getCurrentFormattedDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  
  // 根据月份判断季节
  const month = now.getMonth() + 1; // 月份从0开始
  let season;
  if (month >= 3 && month <= 5) {
    season = '春';
  } else if (month >= 6 && month <= 8) {
    season = '夏';
  } else if (month >= 9 && month <= 11) {
    season = '秋';
  } else {
    season = '冬';
  }
  
  return `${year}年·${season}`;
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
    date: getCurrentFormattedDate(), // 使用当前日期
    theme: 'autumn'
  });

  // UI状态
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState('normal');
  
  // 创建导出任务跟踪系统
  const [exportTasks, setExportTasks] = useState([]);

  // 添加卡片尺寸状态
  const [cardDimensions, setCardDimensions] = useState({
    height: 600,
    contentHeight: 300
  });

  // 引用SVG内容
  const cardPreviewRef = useRef(null);

  // 添加清晰度倍数状态
  const [clarity, setClarity] = useState(1);

  // 在组件加载时和内容变化时实时更新高度
  useEffect(() => {
    updateCardHeight();
  }, [cardData.content, cardData.quote]);
  
  // 在组件首次加载和主题变化时更新日期
  useEffect(() => {
    setCardData(prev => ({
      ...prev,
      date: getCurrentFormattedDate()
    }));
  }, [cardData.theme]);

  // 计算卡片所需高度
  const updateCardHeight = () => {
    const dimensions = calculateCardHeight(cardData.content, cardData.quote);
    setCardDimensions(dimensions);
  };

  // 添加新的导出任务
  const addExportTask = (format, message = '') => {
    const id = Date.now();

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

    return id;
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

  // 处理主题变化
  const handleThemeChange = (theme) => {
    setCardData(prev => ({ ...prev, theme }));
  };

  // 生成卡片
  const generateCard = () => {
    // 更新高度并设置当前日期
    updateCardHeight();
    setCardData(prev => ({ ...prev, date: getCurrentFormattedDate() }));
  };

  // 下载卡片函数
  const downloadCard = async (format = 'svg', scaleFactor = 1) => {
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

      updateExportTask(taskId, { progress: 20, message: '处理SVG数据...' });

      if (format === 'svg') {
        // 导出SVG (SVG格式不受清晰度影响)
        const svgBlob = svgToBlob(svgElement);
        const svgUrl = URL.createObjectURL(svgBlob);

        updateExportTask(taskId, { progress: 70, message: '准备下载...' });
        
        downloadFile(svgUrl, '阅读卡片.svg');
        completeExportTask(taskId, true, 'SVG卡片已成功下载');
      } else if (format === 'png' || format === 'jpg') {
        // 导出PNG/JPG，应用清晰度倍数
        let clarityText = "";
        if (scaleFactor > 1) {
          clarityText = ` (${scaleFactor}x清晰度)`;
        }
        
        updateExportTask(taskId, { 
          progress: 40, 
          message: `转换为${format.toUpperCase()}${clarityText}...` 
        });

        try {
          const { blob, dataUrl } = await svgToCanvas(svgElement, format, cardDimensions, scaleFactor);
          
          updateExportTask(taskId, { progress: 80, message: '准备下载...' });
          
          // 在文件名中标注清晰度
          const filename = scaleFactor > 1 
            ? `阅读卡片_${scaleFactor}x.${format}`
            : `阅读卡片.${format}`;
            
          if (blob) {
            const url = URL.createObjectURL(blob);
            downloadFile(url, filename);
            completeExportTask(taskId, true, `${format.toUpperCase()}卡片已成功下载${clarityText}`);
          } else if (dataUrl) {
            downloadFile(dataUrl, filename);
            completeExportTask(taskId, true, `${format.toUpperCase()}卡片已下载${clarityText}`);
          } else {
            throw new Error(`无法生成${format.toUpperCase()}文件`);
          }
        } catch (err) {
          console.error("转换出错:", err);
          completeExportTask(taskId, false, `导出${format.toUpperCase()}失败`);
        }
      }
    } catch (error) {
      console.error('导出错误:', error);
      completeExportTask(taskId, false, `导出失败: ${error.message}`);
    }
  };

  // 复制到剪贴板
  const copyToClipboard = async (scaleFactor = 1) => {
    const taskId = addExportTask('clipboard', '正在准备复制到剪贴板...');
    
    let clarityText = "";
    if (scaleFactor > 1) {
      clarityText = ` (${scaleFactor}x清晰度)`;
    }
    
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

      // 直接转换为PNG复制 - 跳过尝试SVG复制的步骤
      updateExportTask(taskId, { progress: 40, message: '转换为PNG...' });
        
      try {
        // 使用canvas转换
        const canvas = document.createElement('canvas');
        canvas.width = 800 * scaleFactor;
        canvas.height = cardDimensions.height * scaleFactor;
        const ctx = canvas.getContext('2d');
        
        // 克隆SVG元素
        const clonedSvg = svgElement.cloneNode(true);
        clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        
        // 获取SVG字符串并转换为数据URL
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(clonedSvg);
        const svgURL = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
        
        // 创建图像元素
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        updateExportTask(taskId, { progress: 60, message: '正在绘制图像...' });
        
        // 使用Promise等待图像加载完成
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error('图像加载失败'));
          img.src = svgURL;
        });
        
        // 绘制白色背景和SVG
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        updateExportTask(taskId, { progress: 80, message: '复制到剪贴板...' });
        
        // 尝试多种复制方法
        if (navigator.clipboard && navigator.clipboard.write) {
          // 方法1: 使用标准Clipboard API (现代浏览器)
          canvas.toBlob(async (blob) => {
            try {
              if (blob) {
                await navigator.clipboard.write([
                  new ClipboardItem({ 'image/png': blob })
                ]);
                completeExportTask(taskId, true, `卡片已复制到剪贴板${clarityText}`);
              } else {
                throw new Error('无法创建PNG数据');
              }
            } catch (clipErr) {
              // 尝试备用复制方法
              fallbackCopy();
            }
          }, 'image/png');
        } else {
          // 直接尝试备用方法
          fallbackCopy();
        }
        
        // 备用复制方法
        function fallbackCopy() {
          try {
            // 方法2: 尝试使用execCommand (旧版浏览器)
            canvas.toBlob(blob => {
              try {
                const data = [new ClipboardItem({ 'image/png': blob })];
                const item = new ClipboardItem({ 'image/png': blob });
                navigator.clipboard.write(data).then(() => {
                  completeExportTask(taskId, true, `卡片已复制到剪贴板${clarityText}`);
                }).catch(err => {
                  // 如果还是失败，回退到文本提示
                  textFallback();
                });
              } catch (err) {
                textFallback();
              }
            }, 'image/png');
          } catch (err) {
            textFallback();
          }
        }
        
        // 文本回退方案
        function textFallback() {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText('阅读卡片无法以图像形式复制，请使用下载功能保存卡片。')
              .then(() => {
                completeExportTask(taskId, true, '已复制提示文本（浏览器不支持图像复制）');
              })
              .catch(() => {
                completeExportTask(taskId, false, '复制功能不可用，请使用下载功能');
              });
          } else {
            completeExportTask(taskId, false, '复制功能不可用，请使用下载功能');
          }
        }
      } catch (error) {
        console.error('转换为PNG失败:', error);
        // 尝试文本回退
        if (navigator.clipboard && navigator.clipboard.writeText) {
          try {
            await navigator.clipboard.writeText('阅读卡片无法以图像形式复制，请使用下载功能保存卡片。');
            completeExportTask(taskId, true, '已复制提示文本（图像转换失败）');
          } catch (textErr) {
            completeExportTask(taskId, false, '复制失败，请使用下载功能');
          }
        } else {
          completeExportTask(taskId, false, '复制失败，请使用下载功能');
        }
      }
    } catch (error) {
      console.error('复制流程错误:', error);
      completeExportTask(taskId, false, `复制失败: ${error.message}`);
    }
  };

  // 缩放控制
  const handleZoomIn = () => setZoomLevel('zoom-in');
  const handleZoomOut = () => setZoomLevel('zoom-out');
  const handleZoomReset = () => setZoomLevel('normal');
  const handleFullscreen = () => setIsFullscreen(true);
  const closeFullscreen = () => setIsFullscreen(false);

  return (
    <div className="app-container">
      <Header />

      <main>
        <InputSection 
          cardData={cardData} 
          onInputChange={handleInputChange} 
        />

        <PreviewSection
          cardData={cardData}
          cardDimensions={cardDimensions}
          zoomLevel={zoomLevel}
          cardPreviewRef={cardPreviewRef}
          onGenerate={generateCard}
          onExport={downloadCard}
          onCopy={copyToClipboard}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleZoomReset}
          onFullscreen={handleFullscreen}
          onThemeChange={handleThemeChange}
          clarity={clarity}
          setClarity={setClarity}
        />
      </main>

      {isFullscreen && (
        <FullscreenPreview
          cardData={cardData}
          cardDimensions={cardDimensions}
          zoomLevel={zoomLevel}
          onClose={closeFullscreen}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleZoomReset}
        />
      )}

      <ExportTasksList tasks={exportTasks} />

      <Footer />
    </div>
  );
}

export default App;
