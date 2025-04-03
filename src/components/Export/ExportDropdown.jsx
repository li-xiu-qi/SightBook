import React, { useState, useRef, useEffect } from 'react';

const ExportDropdown = ({ onExport, onCopy }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 关闭导出下拉菜单的点击外部事件
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = (format) => {
    onExport(format);
    setDropdownOpen(false);
  };

  const handleCopy = () => {
    onCopy();
    setDropdownOpen(false);
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className="export-btn"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        导出卡片 <i className={dropdownOpen ? 'rotate' : ''}>{'\u25BC'}</i>
      </button>
      <div className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}>
        <button onClick={() => handleExport('svg')}>SVG格式</button>
        <button onClick={() => handleExport('png')}>PNG格式</button>
        <button onClick={() => handleExport('jpg')}>JPG格式</button>
        <button onClick={handleCopy}>复制到剪贴板</button>
      </div>
    </div>
  );
};

export default ExportDropdown;
