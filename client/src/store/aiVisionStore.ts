import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ModelStatus, AISettings, AnalysisResult, PerformanceMetrics } from '@/types';

interface AIVisionState {
  // 모델 상태
  modelStatus: ModelStatus;
  isLoading: boolean;
  loadingProgress: number;
  loadingMessage: string;
  
  // 설정
  settings: AISettings;
  
  // 분석 결과
  predictions: any[];
  detections: any[];
  analysisResult: AnalysisResult | null;
  
  // 성능 메트릭
  performanceMetrics: PerformanceMetrics | null;
  
  // 웹캠 상태
  isWebcamActive: boolean;
  webcamStream: MediaStream | null;
  
  // UI 상태
  showNeuralNetwork: boolean;
  showActivations: boolean;
  showGradients: boolean;
  
  // 액션들
  setModelStatus: (status: Partial<ModelStatus>) => void;
  setLoading: (loading: boolean, message?: string, progress?: number) => void;
  updateSettings: (settings: Partial<AISettings>) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  setPerformanceMetrics: (metrics: PerformanceMetrics) => void;
  setWebcamStatus: (active: boolean, stream?: MediaStream | null) => void;
  setUIState: (key: string, value: boolean) => void;
  resetState: () => void;
}

const initialSettings: AISettings = {
  detectionThreshold: 0.5,
  maxObjects: 10,
  showBoundingBoxes: true,
  showConfidence: true,
  topK: 5,
  minConfidence: 0.2,
  showPredictions: true,
  realTimeAnalysis: false,
  analysisInterval: 500
};

const initialModelStatus: ModelStatus = {
  mobilenet: false,
  cocoSsd: false,
  pose: false,
  face: false,
  hand: false,
  blazeface: false,
  toxicity: false,
  sentenceEncoder: false,
  custom: false
};

export const useAIVisionStore = create<AIVisionState>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      modelStatus: initialModelStatus,
      isLoading: false,
      loadingProgress: 0,
      loadingMessage: '',
      settings: initialSettings,
      predictions: [],
      detections: [],
      analysisResult: null,
      performanceMetrics: null,
      isWebcamActive: false,
      webcamStream: null,
      showNeuralNetwork: false,
      showActivations: false,
      showGradients: false,

      // 액션들
      setModelStatus: (status) => set((state) => ({
        modelStatus: { ...state.modelStatus, ...status }
      })),

      setLoading: (loading, message = '', progress = 0) => set({
        isLoading: loading,
        loadingMessage: message,
        loadingProgress: progress
      }),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      setAnalysisResult: (result) => set({
        analysisResult: result,
        predictions: result.predictions,
        detections: result.detections
      }),

      setPerformanceMetrics: (metrics) => set({
        performanceMetrics: metrics
      }),

      setWebcamStatus: (active, stream = null) => set({
        isWebcamActive: active,
        webcamStream: stream
      }),

      setUIState: (key, value) => set((state) => ({
        ...state,
        [key]: value
      })),

      resetState: () => set({
        modelStatus: initialModelStatus,
        isLoading: false,
        loadingProgress: 0,
        loadingMessage: '',
        settings: initialSettings,
        predictions: [],
        detections: [],
        analysisResult: null,
        performanceMetrics: null,
        isWebcamActive: false,
        webcamStream: null,
        showNeuralNetwork: false,
        showActivations: false,
        showGradients: false
      })
    }),
    {
      name: 'ai-vision-store'
    }
  )
);
