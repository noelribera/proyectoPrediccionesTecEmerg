// lib/api/client.ts
import {
  AirDataResponse,
  SoundDataResponse,
  WaterDataResponse,
  SensorHistoryResponse,
  SensorStatsResponse,
  TrainingResult,
  PredictionResult,
  ModelInfo,
  HealthCheckResponse,
  RootResponse
} from './models';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }

  // ==================== ENDPOINTS BÁSICOS ====================

  async getRoot(): Promise<RootResponse> {
    return this.fetch<RootResponse>('/');
  }

  async getHealth(): Promise<HealthCheckResponse> {
    return this.fetch<HealthCheckResponse>('/health');
  }

  // ==================== ENDPOINTS DE SENSORES ====================

  async getAirData(params?: {
    limit?: number;
    page?: number;
    page_size?: number;
  }): Promise<AirDataResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.page_size) queryParams.set('page_size', params.page_size.toString());

    const endpoint = queryParams.toString() 
      ? `/api/air?${queryParams.toString()}`
      : '/api/air';

    return this.fetch<AirDataResponse>(endpoint);
  }

  async getSoundData(params?: { 
    limit?: number;
  }): Promise<SoundDataResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.limit) queryParams.set('limit', params.limit.toString());

    const endpoint = queryParams.toString()
      ? `/api/sound?${queryParams.toString()}`
      : '/api/sound';

    return this.fetch<SoundDataResponse>(endpoint);
  }

  async getWaterData(params?: { 
    limit?: number;
  }): Promise<WaterDataResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.limit) queryParams.set('limit', params.limit.toString());

    const endpoint = queryParams.toString()
      ? `/api/water?${queryParams.toString()}`
      : '/api/water';

    return this.fetch<WaterDataResponse>(endpoint);
  }

  // ==================== ENDPOINTS DE HISTORIAL ====================

  async getSensorHistory(
    sensorType: 'air' | 'sound' | 'water',
    params?: {
      device_name?: string;
      limit?: number;
    }
  ): Promise<SensorHistoryResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.device_name) queryParams.set('device_name', params.device_name);
    if (params?.limit) queryParams.set('limit', params.limit.toString());

    const endpoint = queryParams.toString()
      ? `/api/${sensorType}/history?${queryParams.toString()}`
      : `/api/${sensorType}/history`;

    return this.fetch<SensorHistoryResponse>(endpoint);
  }

  // ==================== ENDPOINTS DE ESTADÍSTICAS ====================

  async getSensorStats(
    sensorType: 'air' | 'sound' | 'water',
    deviceName?: string
  ): Promise<SensorStatsResponse> {
    const queryParams = new URLSearchParams();
    
    if (deviceName) queryParams.set('device_name', deviceName);

    const endpoint = queryParams.toString()
      ? `/api/stats/${sensorType}?${queryParams.toString()}`
      : `/api/stats/${sensorType}`;

    return this.fetch<SensorStatsResponse>(endpoint);
  }

  // ==================== ENDPOINTS DE MACHINE LEARNING ====================

  async trainModel(
    sensorType: 'air' | 'sound' | 'water'
  ): Promise<TrainingResult> {
    return this.fetch<TrainingResult>(`/api/ml/train/${sensorType}`, {
      method: 'POST',
    });
  }

  async getPredictions(
    sensorType: 'air' | 'sound' | 'water',
    days?: number
  ): Promise<PredictionResult> {
    const queryParams = new URLSearchParams();
    
    if (days) queryParams.set('days', days.toString());

    const endpoint = queryParams.toString()
      ? `/api/ml/predict/${sensorType}?${queryParams.toString()}`
      : `/api/ml/predict/${sensorType}`;

    return this.fetch<PredictionResult>(endpoint);
  }

  async getModelInfo(
    sensorType: 'air' | 'sound' | 'water'
  ): Promise<ModelInfo> {
    return this.fetch<ModelInfo>(`/api/ml/info/${sensorType}`);
  }

  // ==================== MÉTODOS UTILITARIOS ====================

  async testConnection(): Promise<boolean> {
    try {
      const health = await this.getHealth();
      return health.status === 'healthy';
    } catch {
      return false;
    }
  }

  async getAllSensorsData() {
    const [air, sound, water] = await Promise.allSettled([
      this.getAirData({ limit: 10 }),
      this.getSoundData({ limit: 10 }),
      this.getWaterData({ limit: 10 }),
    ]);

    return {
      air: air.status === 'fulfilled' ? air.value : null,
      sound: sound.status === 'fulfilled' ? sound.value : null,
      water: water.status === 'fulfilled' ? water.value : null,
    };
  }
}

// Exportar instancia singleton
export const apiClient = new ApiClient();