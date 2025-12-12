// lib/api/models.ts
// ==================== TIPOS BASE ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface Pagination {
  page: number;
  page_size: number;
  total_devices: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface Measurement {
  timestamp: string;
  data: Record<string, any>;
}

export interface SensorData {
  device_name: string;
  timestamp: string;
  data: Record<string, any>;
  recent_measurements?: Measurement[];
  [key: string]: any;
}

// ==================== SENSORES ESPECÍFICOS ====================

export interface AirSensorData extends SensorData {
  co2: number;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  battery?: number;
}

export interface SoundSensorData extends SensorData {
  laeq: number;
  lai?: number;
  laimax?: number;
  battery?: number;
}

export interface WaterSensorData extends SensorData {
  water_level: number;
  distance?: number;
  battery?: number;
}

// ==================== RESPONSE DE ENDPOINTS ====================

// GET /api/air
export interface AirDataResponse {
  sensor_type: string;
  pagination: Pagination;
  data: Array<AirSensorData & { recent_measurements: Measurement[] }>;
}

// GET /api/sound
export interface SoundDataResponse {
  sensor_type: string;
  total_devices: number;
  data: Array<SoundSensorData & { recent_measurements: Measurement[] }>;
}

// GET /api/water
export interface WaterDataResponse {
  sensor_type: string;
  total_devices: number;
  data: Array<WaterSensorData & { recent_measurements: Measurement[] }>;
}

// GET /api/{sensor_type}/history
export interface SensorHistoryResponse {
  sensor_type: string;
  device_name?: string;
  total_records: number;
  data: SensorData[];
}

// GET /api/stats/{sensor_type}
export interface SensorStats {
  count: number;
  mean: number;
  min: number;
  max: number;
  median: number;
  q1: number;
  q3: number;
  std: number;
}

export interface SensorStatsResponse {
  sensor_type: string;
  device_name?: string;
  stats: SensorStats;
  timestamp: string;
}

// ==================== MACHINE LEARNING ====================

export interface ModelMetrics {
  r2: number;
  mae: number;
  mse: number;
  rmse: number;
  mape: number;
  explained_variance: number;
  max_error: number;
  mean_error: number;
  std_error: number;
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1?: number;
  confusion_matrix?: number[][];
  classification_report?: Record<string, any>;
}

export interface FeatureImportance {
  [feature: string]: number;
}

export interface TrainingResult {
  success: boolean;
  sensor_type: string;
  metrics: ModelMetrics;
  feature_importances: FeatureImportance;
  samples: {
    total: number;
    train: number;
    test: number;
  };
  percentiles: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
  threshold_used: number;
  model_info: {
    regression: string;
    classification: string;
    features_used: string[];
  };
  files: {
    regression_model: string;
    scaler: string;
    classification_model: string;
  };
  error?: string;
  traceback?: string;
}

export interface Prediction {
  date: string;
  predicted_value: number;
  day: number;
}

export interface PredictionResult {
  success: boolean;
  sensor_type: string;
  last_measurement_date: string;
  prediction_days: number;
  predictions: Prediction[];
  summary: {
    avg: number;
    min: number;
    max: number;
    trend: 'increasing' | 'decreasing';
  };
  error?: string;
}

export interface ModelInfo {
  exists: boolean;
  sensor_type: string;
  model_path?: string;
  last_modified?: string;
}

// ==================== HEALTH CHECK ====================

export interface HealthCheckResponse {
  status: 'healthy' | 'partial';
  redis: string;
  ml_predictor?: string;
  error?: string;
  timestamp: string;
}

// ==================== ROOT ENDPOINT ====================

export interface RootResponse {
  message: string;
  version: string;
  endpoints: {
    sensors: {
      air: string;
      sound: string;
      water: string;
    };
    history: string;
    stats: string;
    ml: {
      train: string;
      predict: string;
      model_info: string;
    };
  };
}