import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    font-family: 'Courier New', monospace;
    background: #0a0a0a;
    color: #00ffff;
    overflow: hidden;
  }

  #root {
    height: 100%;
  }

  /* 스크롤바 스타일링 */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #1a1a2e;
  }

  ::-webkit-scrollbar-thumb {
    background: #00ffff;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #00ccff;
  }

  /* 선택 텍스트 스타일링 */
  ::selection {
    background: #00ffff;
    color: #000;
  }

  /* 포커스 스타일링 */
  *:focus {
    outline: 2px solid #00ffff;
    outline-offset: 2px;
  }

  /* 버튼 기본 스타일 리셋 */
  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
  }

  /* 입력 필드 기본 스타일 리셋 */
  input, textarea, select {
    font-family: inherit;
    border: 1px solid #00ffff;
    background: rgba(0, 0, 0, 0.5);
    color: #00ffff;
    padding: 8px;
    border-radius: 4px;
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: #00ccff;
    box-shadow: 0 0 0 2px rgba(0, 204, 255, 0.2);
  }
`;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>
);
