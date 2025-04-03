import React from 'react';
import themes from '../../config/themes';

const ThemeSelector = ({ currentTheme, onThemeChange }) => {
  // 主题选项定义 - 按照春夏秋冬的顺序排列
  const themeOptions = [
    { value: 'spring', label: '春季主题' },
    { value: 'summer', label: '夏季主题' },
    { value: 'autumn', label: '秋季主题' },
    { value: 'winter', label: '冬季主题' }
  ];
  
  // 获取当前主题的颜色
  const currentThemeColors = themes[currentTheme];

  return (
    <div className="theme-selector">
      <div className="theme-selector-label">选择卡片主题：</div>
      <div className="theme-options">
        {themeOptions.map(theme => (
          <button
            key={theme.value}
            className={`theme-option ${currentTheme === theme.value ? 'active' : ''}`}
            style={{
              backgroundColor: currentTheme === theme.value 
                ? themes[theme.value].primary 
                : themes[theme.value].bgLight,
              color: currentTheme === theme.value ? '#fff' : themes[theme.value].primary
            }}
            onClick={() => onThemeChange(theme.value)}
            title={theme.label}
          >
            {theme.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
