// services/sensorService.ts
import apiClient from '@/lib/api/client';
import { SensorData, SensorReading, ApiResponse } from '@/types/sensor';

class SensorService {
  // Obtener todos los datos de sensores
  async getAllSensors(): Promise<SensorData[]> {
    try {
      const response = await apiClient.get<ApiResponse<SensorData[]>>('/sensors');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching sensors:', error);
      throw error;
    }
  }

  // Obtener datos de un sensor específico
  async getSensorById(id: string): Promise<SensorData> {
    try {
      const response = await apiClient.get<ApiResponse<SensorData>>(`/sensors/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching sensor ${id}:`, error);
      throw error;
    }
  }

  // Obtener datos con filtros
  async getSensorReadings(params?: {
    sensorType?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<SensorReading[]> {
    try {
      const response = await apiClient.get<ApiResponse<SensorReading[]>>('/sensors/readings', {
        params,
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching sensor readings:', error);
      throw error;
    }
  }

  // Enviar nuevo dato de sensor
  async postSensorData(data: Partial<SensorData>): Promise<SensorData> {
    try {
      const response = await apiClient.post<ApiResponse<SensorData>>('/sensors', data);
      return response.data.data;
    } catch (error) {
      console.error('Error posting sensor data:', error);
      throw error;
    }
  }

  // Datos en tiempo real (WebSocket/SSE) - ESTO NO CAMBIA
  setupRealtimeConnection(sensorId: string, onData: (data: SensorData) => void) {
    const eventSource = new EventSource(`${apiClient.defaults.baseURL}/sensors/${sensorId}/stream`);
    
    eventSource.onmessage = (event) => {
      const data: SensorData = JSON.parse(event.data);
      onData(data);
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
    };

    return () => eventSource.close();
  }
}

export const sensorService = new SensorService();