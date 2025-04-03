import React from 'react';

const Footer = () => {
  // 获取当前年份
  const currentYear = new Date().getFullYear();
  
  return (
    <footer>
      <p>SightBook 阅读卡片生成器 &copy; {currentYear}</p>
    </footer>
  );
};

export default Footer;
