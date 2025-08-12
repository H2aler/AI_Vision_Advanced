import express from 'express';
import { exec } from 'child_process';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

import { aiVisionRoutes } from './routes/aiVision';
import { socketHandler } from './socket/socketHandler';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      // TensorFlow.js는 WebGL 셰이더/커널 생성에 new Function을 사용하므로 'unsafe-eval' 필요
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net"],
      // 일부 브라우저는 script-src-elem을 별도로 검사
      scriptSrcElem: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      // 모델/가중치/스택맵 등을 내려받기 위한 네트워크 허용 (광범위 https 허용 유지)
      // Tesseract.js 등 일부 라이브러리가 data: 또는 blob: 스킴으로 fetch를 수행하므로 허용
      connectSrc: ["'self'", "https:", "data:", "blob:"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "blob:"],
      frameSrc: ["'none'"],
      workerSrc: ["'self'", "blob:"],
    },
  },
}));
app.use(compression());
app.use(cors());
app.use(limiter);
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 정적 파일 서빙 (프론트엔드 HTML 파일들)
app.use(express.static(path.join(__dirname, '../../')));

// Socket.io 핸들러 설정
socketHandler(io);

// API 라우트
app.use('/api/ai-vision', aiVisionRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 메인 페이지 라우트
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../ai_vision_advanced.html'));
});

// 고급 AI Vision 페이지
app.get('/advanced', (req, res) => {
  res.sendFile(path.join(__dirname, '../../ai_vision_advanced.html'));
});

// 간단한 AI Vision 페이지 (CSP 호환)
app.get('/simple', (req, res) => {
  res.sendFile(path.join(__dirname, '../../ai_vision_simple.html'));
});

// 404 핸들러
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 서버 시작
server.listen(PORT, () => {
  console.log('🚀 AI Vision Server running on port', PORT);
  console.log('📊 Environment:', NODE_ENV);
  console.log('🔗 Health check: http://localhost:' + PORT + '/health');
  console.log('🌐 Main page: http://localhost:' + PORT);

  // 서버 시작 시 자동으로 브라우저 열기
  const url = `http://localhost:${PORT}/`;
  const platform = process.platform;
  if (platform === 'win32') {
    exec(`start "" "${url}"`);
  } else if (platform === 'darwin') {
    exec(`open "${url}"`);
  } else {
    exec(`xdg-open "${url}"`);
  }
});
