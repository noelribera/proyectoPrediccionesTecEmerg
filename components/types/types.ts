export interface SensorPrediction {
  sensor: string;
  prediction_days: number[];
  predictions: number[];
}

export interface ModelMetrics {
  precision: number;
  recall: number;
  f1_score: number;
  accuracy: number;
  rmse: number;
  mae: number;
  r2_score: number;
}

export interface DeviceData {
  device_name: string;
  timestamp: string;
  data: Record<string, number>;
}

export interface DeviceHistory {
  device_name: string;
  history: {
    timestamp: string;
    data: Record<string, number>;
  }[];
}
