import { Server, Socket } from 'socket.io';

export const socketHandler = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 클라이언트 연결됨: ${socket.id}`);

    // 실시간 분석 시작
    socket.on('start-realtime-analysis', (data) => {
      console.log('실시간 분석 시작:', data);
      socket.emit('analysis-started', { 
        message: '실시간 분석이 시작되었습니다.',
        timestamp: new Date().toISOString()
      });
    });

    // 실시간 분석 중지
    socket.on('stop-realtime-analysis', () => {
      console.log('실시간 분석 중지');
      socket.emit('analysis-stopped', { 
        message: '실시간 분석이 중지되었습니다.',
        timestamp: new Date().toISOString()
      });
    });

    // 분석 결과 전송
    socket.on('analysis-result', (data) => {
      console.log('분석 결과 수신:', data);
      // 다른 클라이언트들에게 결과 브로드캐스트
      socket.broadcast.emit('analysis-update', {
        ...data,
        timestamp: new Date().toISOString()
      });
    });

    // 모델 상태 업데이트
    socket.on('model-status-update', (data) => {
      console.log('모델 상태 업데이트:', data);
      socket.broadcast.emit('model-status-changed', {
        ...data,
        timestamp: new Date().toISOString()
      });
    });

    // 성능 메트릭 전송
    socket.on('performance-metrics', (data) => {
      console.log('성능 메트릭 수신:', data);
      socket.broadcast.emit('metrics-update', {
        ...data,
        timestamp: new Date().toISOString()
      });
    });

    // 에러 로그 전송
    socket.on('error-log', (data) => {
      console.error('클라이언트 에러:', data);
      // 에러 로깅 시스템에 전송
    });

    // 연결 해제
    socket.on('disconnect', () => {
      console.log(`🔌 클라이언트 연결 해제: ${socket.id}`);
    });

    // 에러 처리
    socket.on('error', (error) => {
      console.error('Socket 에러:', error);
    });
  });

  // 서버 전체 브로드캐스트
  setInterval(() => {
    io.emit('server-heartbeat', {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      connections: io.engine.clientsCount
    });
  }, 30000); // 30초마다
};
