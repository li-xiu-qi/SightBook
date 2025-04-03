import React, { useRef, useEffect } from 'react';

const ExportTasksList = ({ tasks }) => {
  const containerRef = useRef(null);

  // 自动滚动到最新的任务
  useEffect(() => {
    if (containerRef.current && tasks.length > 0) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [tasks]);

  if (tasks.length === 0) return null;

  return (
    <div className="export-tasks-container" ref={containerRef}>
      {tasks.map(task => (
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

export default ExportTasksList;
