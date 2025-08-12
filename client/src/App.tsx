import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import styled from 'styled-components';
import { useAIVisionStore } from '@/store/aiVisionStore';
import { aiVisionService } from '@/services/aiVisionService';
import { socketService } from '@/services/socketService';

// Components
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MainView from '@/components/MainView';
import LoadingOverlay from '@/components/LoadingOverlay';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  color: #00ffff;
  font-family: 'Courier New', monospace;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

function App() {
  const { 
    isLoading, 
    setLoading, 
    setModelStatus, 
    resetState 
  } = useAIVisionStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true, 'AI Vision 시스템 초기화 중...', 0);
        
        // AI Vision 서비스 초기화
        const modelStatus = await aiVisionService.initialize();
        setModelStatus(modelStatus);
        
        // Socket.io 연결
        await socketService.connect();
        
        setLoading(false);
        
        console.log('🚀 AI Vision 시스템 초기화 완료');
      } catch (error) {
        console.error('시스템 초기화 실패:', error);
        setLoading(false);
      }
    };

    initializeApp();

    // 컴포넌트 언마운트 시 정리
    return () => {
      socketService.disconnect();
      aiVisionService.dispose();
      resetState();
    };
  }, [setLoading, setModelStatus, resetState]);

  return (
    <Router>
      <AppContainer>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a2e',
              color: '#00ffff',
              border: '1px solid #00ffff',
            },
          }}
        />
        
        <Sidebar />
        
        <MainContent>
          <Header />
          <ContentArea>
            <Routes>
              <Route path="/" element={<MainView />} />
              <Route path="/analysis" element={<MainView />} />
              <Route path="/models" element={<MainView />} />
              <Route path="/settings" element={<MainView />} />
            </Routes>
          </ContentArea>
        </MainContent>
        
        {isLoading && <LoadingOverlay />}
      </AppContainer>
    </Router>
  );
}

export default App;
