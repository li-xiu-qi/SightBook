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
  
  // 创建导出任务跟踪系统
  const [exportTasks, setExportTasks] = useState([]);

  // 添加卡片尺寸状态
  const [cardDimensions, setCardDimensions] = useState({
    height: 600,
    contentHeight: 300
  });

  // 引用SVG内容
  const cardPreviewRef = useRef(null);

  // 在内容变化时重新计算高度
  useEffect(() => {
    updateCardHeight();
  }, [cardData.content, cardData.quote]);

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

  // 生成卡片
  const generateCard = () => {
    updateCardHeight();
  };

  // 下载卡片函数
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

      updateExportTask(taskId, { progress: 20, message: '处理SVG数据...' });

      if (format === 'svg') {
        // 导出SVG
        const svgBlob = svgToBlob(svgElement);
        const svgUrl = URL.createObjectURL(svgBlob);

        updateExportTask(taskId, { progress: 70, message: '准备下载...' });
        
        downloadFile(svgUrl, '阅读卡片.svg');
        completeExportTask(taskId, true, 'SVG卡片已成功下载');
      } else if (format === 'png' || format === 'jpg') {
        updateExportTask(taskId, { progress: 40, message: '转换为图像格式...' });

        try {
          const { blob, dataUrl } = await svgToCanvas(svgElement, format, cardDimensions);
          
          updateExportTask(taskId, { progress: 80, message: '准备下载...' });
          
          if (blob) {
            const url = URL.createObjectURL(blob);
            downloadFile(url, `阅读卡片.${format}`);
            completeExportTask(taskId, true, `${format.toUpperCase()}卡片已成功下载`);
          } else if (dataUrl) {
            downloadFile(dataUrl, `阅读卡片.${format}`);
            completeExportTask(taskId, true, `${format.toUpperCase()}卡片已下载（备用方法）`);
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

      updateExportTask(taskId, { progress: 40, message: '处理SVG数据...' });

      // 尝试方法1：直接复制SVG
      if (navigator.clipboard && window.ClipboardItem) {
        try {
          const svgBlob = svgToBlob(svgElement);
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/svg+xml': svgBlob })
          ]);
          completeExportTask(taskId, true, '卡片已复制到剪贴板');
          return;
        } catch (e) {
          console.warn('SVG复制到剪贴板失败，尝试PNG方法', e);
          updateExportTask(taskId, { progress: 60, message: '尝试PNG方法...' });
        }
      }

      // 尝试方法2：转换为PNG再复制
      try {
        updateExportTask(taskId, { progress: 70, message: '转换为PNG...' });
        
        const { blob, canvas } = await svgToCanvas(svgElement, 'png', cardDimensions);

        updateExportTask(taskId, { progress: 90, message: '复制到剪贴板...' });

        // 复制PNG到剪贴板
        if (navigator.clipboard && navigator.clipboard.write && blob) {
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
