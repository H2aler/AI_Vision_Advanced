import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다.'));
    }
  }
});

// 이미지 업로드 및 분석
router.post('/analyze-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '이미지 파일이 필요합니다.' });
    }

    const imagePath = req.file.path;
    const imageUrl = `/uploads/${req.file.filename}`;

    // 여기서 실제 AI 분석 로직을 구현할 수 있습니다
    const analysisResult = {
      imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      uploadTime: new Date().toISOString(),
      analysis: {
        objects: [],
        classifications: [],
        confidence: 0
      }
    };

    return res.json({
      success: true,
      data: analysisResult
    });

  } catch (error) {
    console.error('이미지 분석 오류:', error);
    return res.status(500).json({ 
      error: '이미지 분석 중 오류가 발생했습니다.',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 모델 상태 확인
router.get('/model-status', (req, res) => {
  const modelStatus = {
    mobilenet: true,
    cocoSsd: true,
    pose: false,
    face: false,
    hand: false,
    blazeface: false,
    toxicity: false,
    sentenceEncoder: false,
    custom: true
  };

  return res.json({
    success: true,
    data: modelStatus
  });
});

// 분석 결과 저장
router.post('/save-analysis', (req, res) => {
  try {
    const { predictions, detections, settings, timestamp } = req.body;
    
    // 여기서 데이터베이스에 저장하는 로직을 구현할 수 있습니다
    const savedData = {
      id: Date.now().toString(),
      predictions,
      detections,
      settings,
      timestamp,
      savedAt: new Date().toISOString()
    };

    return res.json({
      success: true,
      data: savedData
    });

  } catch (error) {
    console.error('분석 결과 저장 오류:', error);
    return res.status(500).json({ 
      error: '분석 결과 저장 중 오류가 발생했습니다.' 
    });
  }
});

// 성능 메트릭 수집
router.post('/metrics', (req, res) => {
  try {
    const { fps, memoryUsage, modelStatus, timestamp } = req.body;
    
    // 성능 메트릭을 저장하거나 모니터링 시스템에 전송
    const metrics = {
      fps,
      memoryUsage,
      modelStatus,
      timestamp,
      collectedAt: new Date().toISOString()
    };

    return res.json({
      success: true,
      data: metrics
    });

  } catch (error) {
    console.error('메트릭 수집 오류:', error);
    return res.status(500).json({ 
      error: '메트릭 수집 중 오류가 발생했습니다.' 
    });
  }
});

export { router as aiVisionRoutes };
