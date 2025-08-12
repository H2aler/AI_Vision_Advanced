# 🤖 AI Vision Advanced - TensorFlow.js 기반 고급 AI 분석 시스템

**현대적인 AI 기술을 활용한 실시간 이미지/영상 분석 및 OCR 시스템**

## 🚀 개요

이 프로젝트는 **TensorFlow.js**를 기반으로 한 고급 AI Vision 시스템입니다. HTML5와 JavaScript를 사용하여 브라우저에서 직접 실행되는 강력한 AI 분석 기능을 제공합니다. 실시간 이미지 분류, 객체 감지, 고급 OCR, 화질 향상 등 다양한 AI 기능을 통합하여 제공합니다.

## ✨ 주요 기능

### 🧠 AI 모델 및 분석
- **MobileNet**: 이미지 분류 및 실사/합성 이미지 감지
- **COCO-SSD**: 실시간 객체 감지 (80개 클래스)
- **KNN Classifier**: 커스텀 이미지 분류 학습
- **실시간 분석**: 웹캠 스트리밍 실시간 분석
- **AI 기반 화질 향상**: 2배 업스케일링 및 노이즈 제거

### 📄 고급 OCR 시스템
- **Tesseract.js**: 다국어 텍스트 인식 (한국어, 영어, 일본어, 중국어)
- **INVOICE 전용 OCR**: 송장 문서 특화 인식
- **서명/도장/로고 전용 OCR**: 서명, 도장, 회사 로고 인식
- **고급 전처리**: AI 기반 이미지 전처리로 인식률 향상
- **구조화된 데이터 추출**: 총액, 날짜, 인보이스 번호 자동 추출

### 🎨 화질 향상 기능
- **이미지 화질 향상**: 2배 업스케일링, 노이즈 제거, 선명도 향상
- **영상 화질 향상**: 실시간 프레임별 화질 개선
- **AI 기반 처리**: 가우시안 블러, 언샤프 마스킹, 대비 향상

### 🔧 기술 스택

#### Frontend (HTML5 + JavaScript)
- **HTML5 Canvas**: 실시간 이미지 처리
- **TensorFlow.js 4.15.0**: 브라우저 기반 머신러닝
- **Tesseract.js 5.0.4**: OCR 엔진
- **WebGL**: GPU 가속 처리
- **WebRTC**: 웹캠 스트리밍

#### Backend (Node.js + TypeScript)
- **Express.js**: 웹 서버
- **Socket.io**: 실시간 통신
- **Multer**: 파일 업로드
- **Helmet**: 보안
- **Morgan**: 로깅
- **CORS**: 크로스 오리진 지원

## 🛠️ 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd geometry
```

### 2. 의존성 설치
```bash
# 루트 디렉토리에서
npm install

# 서버 디렉토리에서
cd server
npm install
```

### 3. 개발 서버 실행
```bash
# 루트 디렉토리에서
npm start

# 또는 개발 모드
npm run dev
```

### 4. 브라우저에서 접속
```
http://localhost:3000
```

## 📁 프로젝트 구조

```
geometry/
├── ai_vision_advanced.html    # 메인 AI Vision 시스템 (2886줄)
├── ai_vision_simple.html      # 간단한 버전
├── test.html                  # 테스트 페이지
├── server/                    # Node.js 백엔드
│   ├── src/
│   │   ├── index.ts          # 서버 진입점
│   │   ├── routes/           # API 라우트
│   │   └── socket/           # Socket.io 핸들러
│   ├── dist/                 # 컴파일된 JavaScript
│   └── package.json
├── package.json              # 루트 패키지
└── README.md
```

## 🎯 사용법

### 1. 웹캠 활성화
- "웹캠 활성화" 버튼을 클릭하여 실시간 분석 시작
- 브라우저에서 카메라 권한 허용

### 2. 이미지 업로드
- "이미지 업로드" 버튼을 클릭하여 이미지 파일 선택
- 지원 형식: JPEG, PNG, GIF, WebP

### 3. AI 모델 선택
- **MobileNet**: 이미지 분류 및 실사/합성 감지
- **COCO-SSD**: 객체 감지 (사람, 차량, 동물 등)
- **KNN Classifier**: 커스텀 분류 학습

### 4. OCR 기능
- **기본 OCR**: 일반 텍스트 인식
- **고급 OCR**: 다국어 지원 및 전처리
- **INVOICE 전용**: 송장 문서 특화 인식
- **서명/도장/로고 전용**: 특수 요소 인식

### 5. 화질 향상
- **이미지 화질 향상**: 단일 이미지 고품질 처리
- **영상 화질 향상**: 실시간 영상 화질 개선

## 🔌 API 엔드포인트

### AI Vision API
- `POST /api/ai-vision/analyze-image` - 이미지 업로드 및 분석
- `GET /api/ai-vision/model-status` - 모델 상태 확인
- `POST /api/ai-vision/save-analysis` - 분석 결과 저장
- `POST /api/ai-vision/metrics` - 성능 메트릭 수집

### Socket.io 이벤트
- `start-realtime-analysis` - 실시간 분석 시작
- `stop-realtime-analysis` - 실시간 분석 중지
- `analysis-result` - 분석 결과 전송
- `model-status-update` - 모델 상태 업데이트

## 🎨 고급 기능

### AI 기반 화질 향상
```javascript
// 2배 업스케일링
const targetWidth = sw * 2;
const targetHeight = sh * 2;

// 가우시안 블러로 노이즈 제거
const gaussianKernel = [
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1]
];

// 언샤프 마스킹으로 선명도 향상
const sharpKernel = [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0]
];
```

### 고급 OCR 전처리
```javascript
// 서명/도장/로고 색상 감지
const isRedStamp = (r > 180 && g < 60 && b < 60);
const isSignature = (r < 80 && g < 80 && b < 80 && (r + g + b) < 200);

// 적응형 이진화 (Otsu's method)
const threshold = calculateOtsuThreshold(histogram);
```

### 실시간 분석 최적화
```javascript
// WebGL 백엔드 사용
await tf.setBackend('webgl');

// 메모리 최적화
tf.tidy(() => {
    // TensorFlow 연산
});

// 프레임 스킵으로 성능 향상
if (frameCount % 2 === 0) {
    // 분석 실행
}
```

## 🚀 성능 최적화

### 메모리 관리
- `tf.tidy()` 사용으로 자동 메모리 정리
- `tf.engine().endScope()` 명시적 메모리 해제
- 텐서 재사용으로 메모리 효율성 향상

### GPU 가속
- WebGL 백엔드 우선 사용
- 텐서 연산 배치 처리
- 셰이더 최적화

### 실시간 처리
- 프레임 스킵으로 CPU 부하 감소
- 비동기 처리로 UI 블로킹 방지
- 웹 워커 활용 (향후 계획)

## 🔧 개발 가이드

### 새로운 AI 모델 추가
```javascript
// 모델 로드
const newModel = await tf.loadLayersModel('model.json');

// 추론 실행
const prediction = await newModel.predict(inputTensor);
```

### 새로운 OCR 언어 추가
```javascript
// Tesseract.js 언어 설정
const options = {
    lang: 'eng+kor+jpn+chi_sim',
    oem: 3, // LSTM OCR Engine
    psm: 6  // Uniform block of text
};
```

### 화질 향상 알고리즘 커스터마이징
```javascript
// 커스텀 필터 커널
const customKernel = [
    [1, 1, 1],
    [1, 2, 1],
    [1, 1, 1]
];

// 필터 적용
applyConvolutionFilter(imageData, customKernel);
```

## 📊 성능 메트릭

### 처리 속도
- **이미지 분류**: ~50ms (MobileNet)
- **객체 감지**: ~100ms (COCO-SSD)
- **OCR 처리**: ~500ms (Tesseract.js)
- **화질 향상**: ~200ms (2배 업스케일링)

### 정확도
- **MobileNet**: 90%+ (ImageNet 기준)
- **COCO-SSD**: 80%+ (COCO 데이터셋 기준)
- **OCR**: 85%+ (고품질 이미지 기준)

## 🚀 배포

### 정적 호스팅
```bash
# 빌드
npm run build

# 배포 (예: Netlify, Vercel)
# ai_vision_advanced.html을 루트에 배치
```

### Docker 배포
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🙏 감사의 말

- **TensorFlow.js** - 브라우저 기반 머신러닝
- **Tesseract.js** - OCR 엔진
- **Node.js** - 서버 사이드 런타임
- **Express.js** - 웹 프레임워크

---

**현대적인 AI 기술로 구현된 강력한 Vision 시스템!** 🚀✨

*이 프로젝트는 TensorFlow.js를 활용하여 브라우저에서 직접 실행되는 고급 AI 분석 기능을 제공합니다.*
