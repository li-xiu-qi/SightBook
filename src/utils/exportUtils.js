/**
 * 将SVG导出为各种格式
 */

// SVG转为Blob对象
export const svgToBlob = (svgElement) => {
  // 克隆SVG元素以避免修改原始DOM
  const clonedSvg = svgElement.cloneNode(true);
  
  // 设置必要的属性
  clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clonedSvg.setAttribute('width', '800px');
  clonedSvg.setAttribute('height', clonedSvg.getAttribute('height') || '600px');

  // 获取SVG的XML字符串
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clonedSvg);

  // 添加XML声明
  const svgData = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + svgString;
  
  return new Blob([svgData], { type: 'image/svg+xml' });
};

// SVG转为PNG/JPG
export const svgToCanvas = async (svgElement, format = 'png', dimensions, scaleFactor = 1) => {
  return new Promise((resolve, reject) => {
    try {
      // 克隆SVG元素
      const clonedSvg = svgElement.cloneNode(true);
      clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

      // 获取SVG字符串
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(clonedSvg);

      // 转换为Base64数据URL
      const base64SVG = btoa(unescape(encodeURIComponent(svgString)));
      const imgSrc = `data:image/svg+xml;base64,${base64SVG}`;

      // 创建Canvas并应用清晰度倍数
      const canvas = document.createElement('canvas');
      // 根据清晰度倍数调整canvas尺寸
      canvas.width = 800 * scaleFactor;
      canvas.height = (dimensions.height || 600) * scaleFactor;
      const ctx = canvas.getContext('2d');

      // 创建图像元素
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        // 绘制白色背景
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 应用清晰度倍数进行缩放绘制
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 根据格式导出
        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const quality = format === 'jpg' ? 0.9 : undefined;

        try {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve({ 
                  blob, 
                  canvas, 
                  dataUrl: canvas.toDataURL(mimeType, quality),
                  scaleFactor 
                });
              } else {
                reject(new Error(`无法生成${format.toUpperCase()}文件`));
              }
            },
            mimeType,
            quality
          );
        } catch (err) {
          // 回退方法
          try {
            const dataUrl = canvas.toDataURL(mimeType, quality);
            resolve({ dataUrl, canvas, scaleFactor });
          } catch (backupErr) {
            reject(backupErr);
          }
        }
      };

      img.onerror = (err) => {
        reject(new Error('图像加载失败'));
      };

      img.src = imgSrc;
    } catch (error) {
      reject(error);
    }
  });
};

// 下载文件
export const downloadFile = (url, filename) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // 如果是对象URL，释放它
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};
