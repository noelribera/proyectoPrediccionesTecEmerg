// lib/api/utils.ts
import {
  AirSensorData,
  SoundSensorData,
  WaterSensorData,
  SensorData,
  Prediction,
} from './models';

// ==================== TRANSFORMADORES DE DATOS ====================

export function transformAirDataForChart(
  sensorData: AirSensorData[],
  limit: number = 10
) {
  return sensorData.slice(0, limit).map((sensor, index) => ({
    name: sensor.device_name,
    time: new Date(sensor.timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    co2: sensor.co2 || 0,
    temperature: sensor.temperature || 0,
    humidity: sensor.humidity || 0,
    battery: sensor.battery || 0,
  }));
}

export function transformSoundDataForChart(
  sensorData: SoundSensorData[],
  limit: number = 10
) {
  return sensorData.slice(0, limit).map((sensor, index) => ({
    name: sensor.device_name,
    time: new Date(sensor.timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    laeq: sensor.laeq || 0,
    laimax: sensor.laimax || 0,
    battery: sensor.battery || 0,
  }));
}

export function transformWaterDataForChart(
  sensorData: WaterSensorData[],
  limit: number = 10
) {
  return sensorData.slice(0, limit).map((sensor, index) => ({
    name: sensor.device_name,
    time: new Date(sensor.timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    water_level: sensor.water_level || 0,
    distance: sensor.distance || 0,
    battery: sensor.battery || 0,
  }));
}

export function transformHistoryForChart(
  historyData: SensorData[],
  sensorType: 'air' | 'sound' | 'water'
) {
  return historyData.map((record) => {
    const base = {
      timestamp: new Date(record.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      date: new Date(record.timestamp).toLocaleDateString(),
    };

    switch (sensorType) {
      case 'air':
        return {
          ...base,
          co2: record.data?.co2 || 0,
          temperature: record.data?.temperature || 0,
        };
      case 'sound':
        return {
          ...base,
          laeq: record.data?.laeq || 0,
        };
      case 'water':
        return {
          ...base,
          water_level: record.data?.water_level || 0,
        };
      default:
        return base;
    }
  });
}

export function transformPredictionsForChart(
  predictions: Prediction[]
) {
  return predictions.map((pred) => ({
    ...pred,
    date: new Date(pred.date).toLocaleDateString(),
    day: `Día ${pred.day}`,
  }));
}

// ==================== VALIDADORES ====================

export function isValidSensorType(type: string): type is 'air' | 'sound' | 'water' {
  return ['air', 'sound', 'water'].includes(type);
}

export function getSensorLabel(type: 'air' | 'sound' | 'water'): string {
  const labels = {
    air: 'Calidad del Aire',
    sound: 'Nivel de Sonido',
    water: 'Nivel de Agua',
  };
  return labels[type];
}

export function getSensorUnit(type: 'air' | 'sound' | 'water'): string {
  const units = {
    air: 'ppm',
    sound: 'dB',
    water: 'u',
  };
  return units[type];
}

// ==================== CÁLCULO DE ESTADÍSTICAS ====================

export function calculateKPIs(sensorData: any[], type: 'air' | 'sound' | 'water') {
  if (!sensorData.length) return null;

  const values = sensorData.map(item => {
    switch (type) {
      case 'air': return item.co2 || 0;
      case 'sound': return item.laeq || 0;
      case 'water': return item.water_level || 0;
      default: return 0;
    }
  });

  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);

  // Calcular tendencia (último vs primero)
  const trend = values[values.length - 1] > values[0] ? 'increasing' : 'decreasing';

  return {
    avg: parseFloat(avg.toFixed(2)),
    min: parseFloat(min.toFixed(2)),
    max: parseFloat(max.toFixed(2)),
    trend,
    count: values.length,
  };
}