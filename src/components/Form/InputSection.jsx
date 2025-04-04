import React from 'react';
import ListStyleSelector from './ListStyleSelector';

const InputSection = ({ cardData, onInputChange, listStyle, setListStyle }) => {
  return (
    <div className="input-section">
      <h2>输入内容</h2>
      <form>
        <div className="form-group">
          <label htmlFor="title">卡片标题</label>
          <input
            id="title"
            type="text"
            value={cardData.title}
            onChange={onInputChange}
            placeholder="例如: #今日份阅读"
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">作者名称</label>
          <input
            id="author"
            type="text"
            value={cardData.author}
            onChange={onInputChange}
            placeholder="例如: 筱可："
          />
        </div>

        <div className="form-group">
          <label htmlFor="quote">引言/摘要</label>
          <textarea
            id="quote"
            value={cardData.quote}
            onChange={onInputChange}
            placeholder="作者的主要观点或引言"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">正文内容</label>
          <ListStyleSelector listStyle={listStyle} setListStyle={setListStyle} />
          <textarea
            id="content"
            rows={10}
            value={cardData.content}
            onChange={onInputChange}
            placeholder="输入主要内容，每段将自动生成序号"
          />
        </div>

        <div className="form-group">
          <label htmlFor="footer">底部署名</label>
          <input
            id="footer"
            type="text"
            value={cardData.footer}
            onChange={onInputChange}
            placeholder="例如: 秋日思绪，温暖心灵"
          />
        </div>
      </form>
    </div>
  );
};

export default InputSection;
