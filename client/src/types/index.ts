export interface ModelStatus {
  mobilenet: boolean;
  cocoSsd: boolean;
  pose: boolean;
  face: boolean;
  hand: boolean;
  blazeface: boolean;
  toxicity: boolean;
  sentenceEncoder: boolean;
  custom: boolean;
}

export interface AISettings {
  detectionThreshold: number;
  maxObjects: number;
  showBoundingBoxes: boolean;
  showConfidence: boolean;
  topK: number;
  minConfidence: number;
  showPredictions: boolean;
  realTimeAnalysis: boolean;
  analysisInterval: number;
}

export interface Detection {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

export interface Prediction {
  className: string;
  probability: number;
}

export interface AnalysisResult {
  predictions: Prediction[];
  detections: Detection[];
  timestamp: string;
}

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  modelStatus: ModelStatus;
  timestamp: string;
}

export interface UploadedImage {
  imageUrl: string;
  filename: string;
  originalName: string;
  size: number;
  uploadTime: string;
  analysis: {
    objects: Detection[];
    classifications: Prediction[];
    confidence: number;
  };
}

export interface SocketEvents {
  'start-realtime-analysis': (data: any) => void;
  'stop-realtime-analysis': () => void;
  'analysis-result': (data: AnalysisResult) => void;
  'model-status-update': (data: ModelStatus) => void;
  'performance-metrics': (data: PerformanceMetrics) => void;
  'error-log': (data: any) => void;
  'analysis-started': (data: any) => void;
  'analysis-stopped': (data: any) => void;
  'analysis-update': (data: AnalysisResult) => void;
  'model-status-changed': (data: ModelStatus) => void;
  'metrics-update': (data: PerformanceMetrics) => void;
  'server-heartbeat': (data: any) => void;
}
