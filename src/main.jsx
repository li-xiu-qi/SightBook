import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 创建根容器并设置高度为自适应
const rootElement = document.getElementById('root')
rootElement.style.minHeight = '100vh'
rootElement.style.display = 'flex'

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
