import { io, Socket } from 'socket.io-client';
import { useAIVisionStore } from '@/store/aiVisionStore';
import { SocketEvents } from '@/types';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private store = useAIVisionStore.getState();

  async connect(): Promise<void> {
    try {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      this.setupEventListeners();
      
      return new Promise((resolve, reject) => {
        this.socket!.on('connect', () => {
          console.log('🔌 Socket.io 연결됨:', this.socket!.id);
          resolve();
        });

        this.socket!.on('connect_error', (error) => {
          console.error('Socket.io 연결 실패:', error);
          reject(error);
        });
      });
    } catch (error) {
      console.error('Socket.io 연결 실패:', error);
      throw error;
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // 서버로부터의 이벤트 수신
    this.socket.on('analysis-started', (data) => {
      console.log('분석 시작됨:', data);
    });

    this.socket.on('analysis-stopped', (data) => {
      console.log('분석 중지됨:', data);
    });

    this.socket.on('analysis-update', (data) => {
      console.log('분석 업데이트:', data);
      this.store.setAnalysisResult(data);
    });

    this.socket.on('model-status-changed', (data) => {
      console.log('모델 상태 변경:', data);
      this.store.setModelStatus(data);
    });

    this.socket.on('metrics-update', (data) => {
      console.log('메트릭 업데이트:', data);
      this.store.setPerformanceMetrics(data);
    });

    this.socket.on('server-heartbeat', (data) => {
      console.log('서버 하트비트:', data);
    });

    // 연결 상태 이벤트
    this.socket.on('disconnect', () => {
      console.log('🔌 Socket.io 연결 해제');
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔌 Socket.io 재연결됨 (시도:', attemptNumber, ')');
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('Socket.io 재연결 실패:', error);
    });
  }

  // 서버로 이벤트 전송
  emit<T extends keyof SocketEvents>(event: T, data?: Parameters<SocketEvents[T]>[0]): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // 실시간 분석 시작
  startRealtimeAnalysis(settings: any): void {
    this.emit('start-realtime-analysis', settings);
  }

  // 실시간 분석 중지
  stopRealtimeAnalysis(): void {
    this.emit('stop-realtime-analysis');
  }

  // 분석 결과 전송
  sendAnalysisResult(result: any): void {
    this.emit('analysis-result', result);
  }

  // 모델 상태 업데이트
  updateModelStatus(status: any): void {
    this.emit('model-status-update', status);
  }

  // 성능 메트릭 전송
  sendPerformanceMetrics(metrics: any): void {
    this.emit('performance-metrics', metrics);
  }

  // 에러 로그 전송
  sendErrorLog(error: any): void {
    this.emit('error-log', error);
  }

  // 연결 해제
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // 연결 상태 확인
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Socket ID 반환
  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

export const socketService = new SocketService();
