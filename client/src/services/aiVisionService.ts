import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import axios from 'axios';
import { ModelStatus, AISettings, AnalysisResult, PerformanceMetrics } from '@/types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class AIVisionService {
  private models: {
    mobilenet: any;
    cocoSsd: any;
    custom: any;
  } = {
    mobilenet: null,
    cocoSsd: null,
    custom: null
  };

  private modelStatus: ModelStatus = {
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

  async initialize(): Promise<ModelStatus> {
    try {
      // TensorFlow.js 초기화
      await tf.setBackend('webgl');
      await tf.ready();
      console.log('TensorFlow.js 초기화 완료:', tf.getBackend());

      // 모델 로드
      await this.loadModels();

      return this.modelStatus;
    } catch (error) {
      console.error('AI Vision 서비스 초기화 실패:', error);
      throw error;
    }
  }

  private async loadModels(): Promise<void> {
    try {
      // MobileNet 모델 로드
      console.log('MobileNet 모델 로딩 중...');
      this.models.mobilenet = await mobilenet.load();
      this.modelStatus.mobilenet = true;
      console.log('MobileNet 모델 로드 완료');

      // COCO-SSD 모델 로드
      console.log('COCO-SSD 모델 로딩 중...');
      this.models.cocoSsd = await cocoSsd.load();
      this.modelStatus.cocoSsd = true;
      console.log('COCO-SSD 모델 로드 완료');

      // 커스텀 신경망 생성
      console.log('커스텀 신경망 생성 중...');
      this.models.custom = this.createCustomNeuralNetwork();
      this.modelStatus.custom = true;
      console.log('커스텀 신경망 생성 완료');

    } catch (error) {
      console.error('모델 로드 실패:', error);
      throw error;
    }
  }

  private createCustomNeuralNetwork() {
    const model = tf.sequential();
    
    model.add(tf.layers.conv2d({
      inputShape: [224, 224, 3],
      filters: 32,
      kernelSize: 3,
      activation: 'relu'
    }));
    
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    
    model.add(tf.layers.conv2d({
      filters: 64,
      kernelSize: 3,
      activation: 'relu'
    }));
    
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({ units: 128, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.5 }));
    model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));
    
    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
    
    return model;
  }

  async analyzeImage(imageElement: HTMLImageElement | HTMLVideoElement, settings: AISettings): Promise<AnalysisResult> {
    try {
      const predictions: any[] = [];
      const detections: any[] = [];

      // 이미지 분류
      if (this.modelStatus.mobilenet && settings.showPredictions) {
        const mobilenetPredictions = await this.models.mobilenet.classify(imageElement, settings.topK);
        predictions.push(...mobilenetPredictions.filter((p: any) => p.probability >= settings.minConfidence));
      }

      // 객체 감지
      if (this.modelStatus.cocoSsd && settings.showBoundingBoxes) {
        const cocoDetections = await this.models.cocoSsd.detect(imageElement, settings.maxObjects, settings.detectionThreshold);
        detections.push(...cocoDetections);
      }

      // 커스텀 모델 분석
      if (this.modelStatus.custom) {
        await this.analyzeWithCustomModel(imageElement);
      }

      const result: AnalysisResult = {
        predictions,
        detections,
        timestamp: new Date().toISOString()
      };

      return result;
    } catch (error) {
      console.error('이미지 분석 실패:', error);
      throw error;
    }
  }

  private async analyzeWithCustomModel(imageElement: HTMLImageElement | HTMLVideoElement) {
    try {
      const tensor = tf.browser.fromPixels(imageElement);
      const resized = tf.image.resizeBilinear(tensor, [224, 224]);
      const normalized = resized.div(255.0);
      const batched = normalized.expandDims(0);
      
      const prediction = this.models.custom.predict(batched);
      const result = await prediction.data();
      
      // 메모리 정리
      tensor.dispose();
      resized.dispose();
      normalized.dispose();
      batched.dispose();
      prediction.dispose();
      
      console.log('커스텀 모델 예측:', result);
    } catch (error) {
      console.error('커스텀 모델 분석 실패:', error);
    }
  }

  async uploadImage(file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(`${API_BASE_URL}/ai-vision/analyze-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      throw error;
    }
  }

  async saveAnalysisResult(result: AnalysisResult, settings: AISettings): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai-vision/save-analysis`, {
        predictions: result.predictions,
        detections: result.detections,
        settings,
        timestamp: result.timestamp
      });

      return response.data;
    } catch (error) {
      console.error('분석 결과 저장 실패:', error);
      throw error;
    }
  }

  async sendPerformanceMetrics(metrics: PerformanceMetrics): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai-vision/metrics`, metrics);
      return response.data;
    } catch (error) {
      console.error('성능 메트릭 전송 실패:', error);
      throw error;
    }
  }

  getModelStatus(): ModelStatus {
    return { ...this.modelStatus };
  }

  getMemoryInfo(): { numBytes: number; numTensors: number } {
    return tf.memory();
  }

  dispose(): void {
    // 모델 메모리 정리
    Object.values(this.models).forEach(model => {
      if (model && typeof model.dispose === 'function') {
        model.dispose();
      }
    });
  }
}

export const aiVisionService = new AIVisionService();
