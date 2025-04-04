import React from 'react';

const ListStyleSelector = ({ listStyle, setListStyle }) => {
  return (
    <div className="list-style-selector">
      <label htmlFor="list-style-select">段落列表样式：</label>
      <select 
        id="list-style-select" 
        value={listStyle} 
        onChange={(e) => setListStyle(e.target.value)}
        className="list-style-select"
      >
        <option value="ordered">有序列表 (1. 2. 3.)</option>
        <option value="unordered">无序列表 (• • •)</option>
        <option value="none">不使用列表</option>
      </select>
    </div>
  );
};

export default ListStyleSelector;
