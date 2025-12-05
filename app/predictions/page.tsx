"use client";

import React, { useState, useEffect } from 'react';
import AuthGuard from "@/components/AuthGuard"


// Tipos de datos
interface SensorDato {
  fecha: string;
  hora: string;
  valor: number;
  prediccion: number;
}

interface SensorMetricas {
  presicion: number;
  recall: number;
  f1score: number;
  support: number;
  ultimaActualizacion: string;
}

interface SensorInfo {
  nombre: string;
  icono: string;
  color: string;
  unidad: string;
  datos: SensorDato[];
  metricas: SensorMetricas;
}

interface SensorData {
  soterrados: SensorInfo;
  humedad: SensorInfo;
  temperatura: SensorInfo;
}

interface RangoFechas {
  inicio: string;
  fin: string;
}

// Tipo para las claves de sensorData
type SensorType = keyof SensorData;

// Datos simulados en formato JSON con métricas actualizadas
const sensorData: SensorData = {
  soterrados: {
    nombre: "Sensores Soterrados",
    icono: "📡",
    color: "from-purple-600 to-indigo-700",
    unidad: "uV",
    metricas: {
      presicion: 0.94,
      recall: 0.91,
      f1score: 0.925,
      support: 1250,
      ultimaActualizacion: "2023-10-02 14:30"
    },
    datos: [
      { fecha: "2023-10-01", hora: "00:00", valor: 120, prediccion: 125 },
      { fecha: "2023-10-01", hora: "04:00", valor: 118, prediccion: 122 },
      { fecha: "2023-10-01", hora: "08:00", valor: 125, prediccion: 130 },
      { fecha: "2023-10-01", hora: "12:00", valor: 130, prediccion: 135 },
      { fecha: "2023-10-01", hora: "16:00", valor: 128, prediccion: 132 },
      { fecha: "2023-10-01", hora: "20:00", valor: 122, prediccion: 127 },
      { fecha: "2023-10-02", hora: "00:00", valor: 121, prediccion: 126 },
      { fecha: "2023-10-02", hora: "04:00", valor: 119, prediccion: 124 },
      { fecha: "2023-10-02", hora: "08:00", valor: 124, prediccion: 129 },
      { fecha: "2023-10-02", hora: "12:00", valor: 129, prediccion: 134 },
      { fecha: "2023-10-02", hora: "16:00", valor: 127, prediccion: 131 },
      { fecha: "2023-10-02", hora: "20:00", valor: 123, prediccion: 128 },
    ]
  },
  humedad: {
    nombre: "Sensores de Humedad",
    icono: "💧",
    color: "from-blue-600 to-cyan-600",
    unidad: "%",
    metricas: {
      presicion: 0.88,
      recall: 0.92,
      f1score: 0.899,
      support: 980,
      ultimaActualizacion: "2023-10-02 14:30"
    },
    datos: [
      { fecha: "2023-10-01", hora: "00:00", valor: 65, prediccion: 68 },
      { fecha: "2023-10-01", hora: "04:00", valor: 68, prediccion: 70 },
      { fecha: "2023-10-01", hora: "08:00", valor: 62, prediccion: 65 },
      { fecha: "2023-10-01", hora: "12:00", valor: 58, prediccion: 60 },
      { fecha: "2023-10-01", hora: "16:00", valor: 55, prediccion: 57 },
      { fecha: "2023-10-01", hora: "20:00", valor: 60, prediccion: 63 },
      { fecha: "2023-10-02", hora: "00:00", valor: 63, prediccion: 66 },
      { fecha: "2023-10-02", hora: "04:00", valor: 66, prediccion: 68 },
      { fecha: "2023-10-02", hora: "08:00", valor: 60, prediccion: 63 },
      { fecha: "2023-10-02", hora: "12:00", valor: 56, prediccion: 58 },
      { fecha: "2023-10-02", hora: "16:00", valor: 53, prediccion: 55 },
      { fecha: "2023-10-02", hora: "20:00", valor: 58, prediccion: 61 },
    ]
  },
  temperatura: {
    nombre: "Sensores de Temperatura",
    icono: "🌡️",
    color: "from-orange-600 to-red-600",
    unidad: "°C",
    metricas: {
      presicion: 0.96,
      recall: 0.94,
      f1score: 0.95,
      support: 1120,
      ultimaActualizacion: "2023-10-02 14:30"
    },
    datos: [
      { fecha: "2023-10-01", hora: "00:00", valor: 22, prediccion: 23 },
      { fecha: "2023-10-01", hora: "04:00", valor: 21, prediccion: 22 },
      { fecha: "2023-10-01", hora: "08:00", valor: 23, prediccion: 24 },
      { fecha: "2023-10-01", hora: "12:00", valor: 25, prediccion: 26 },
      { fecha: "2023-10-01", hora: "16:00", valor: 26, prediccion: 27 },
      { fecha: "2023-10-01", hora: "20:00", valor: 24, prediccion: 25 },
      { fecha: "2023-10-02", hora: "00:00", valor: 23, prediccion: 24 },
      { fecha: "2023-10-02", hora: "04:00", valor: 22, prediccion: 23 },
      { fecha: "2023-10-02", hora: "08:00", valor: 24, prediccion: 25 },
      { fecha: "2023-10-02", hora: "12:00", valor: 26, prediccion: 27 },
      { fecha: "2023-10-02", hora: "16:00", valor: 27, prediccion: 28 },
      { fecha: "2023-10-02", hora: "20:00", valor: 25, prediccion: 26 },
    ]
  }
};

// Fechas predefinidas para evitar problemas de hydration
const fechasPrediccionPredefinidas = [
  "2023-10-03", "2023-10-04", "2023-10-05", "2023-10-06", "2023-10-07",
  "2023-10-08", "2023-10-09", "2023-10-10", "2023-10-11", "2023-10-12",
  "2023-10-13", "2023-10-14", "2023-10-15", "2023-10-16", "2023-10-17",
  "2023-10-18", "2023-10-19", "2023-10-20", "2023-10-21", "2023-10-22",
  "2023-10-23", "2023-10-24", "2023-10-25", "2023-10-26", "2023-10-27",
  "2023-10-28", "2023-10-29", "2023-10-30", "2023-10-31", "2023-11-01",
  "2023-11-02", "2023-11-03", "2023-11-04", "2023-11-05", "2023-11-06",
  "2023-11-07", "2023-11-08", "2023-11-09", "2023-11-10", "2023-11-11",
  "2023-11-12", "2023-11-13", "2023-11-14", "2023-11-15", "2023-11-16",
  "2023-11-17", "2023-11-18", "2023-11-19", "2023-11-20", "2023-11-21",
  "2023-11-22", "2023-11-23", "2023-11-24", "2023-11-25", "2023-11-26",
  "2023-11-27", "2023-11-28", "2023-11-29", "2023-11-30", "2023-12-01"
];

// Componente de Barra de Métricas con props tipados
interface MetricBarProps {
  value: number;
  label: string;
}

const MetricBar = ({ value, label }: MetricBarProps) => {
  const percentage = value * 100;
  const colorClass = percentage >= 90 ? 'from-green-500 to-emerald-500' :
                     percentage >= 80 ? 'from-blue-500 to-cyan-500' :
                     percentage >= 70 ? 'from-yellow-500 to-orange-500' :
                     'from-red-500 to-pink-500';

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-slate-300 mb-1">
        <span className="font-medium">{label}</span>
        <span className="font-bold">{percentage.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${colorClass}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

// Tipo para el estado de métricas del rango
interface MetricasRango {
  promedioPrediccion: string;
  rangoPrediccion: string;
  muestras: number;
}

// Componente principal
export default function SensorPredictionsPage() {
  const [sensorSeleccionado, setSensorSeleccionado] = useState<SensorType>('soterrados');
  const [tipoPrediccion, setTipoPrediccion] = useState<'dia' | 'rango'>('dia');
  const [fechaPrediccion, setFechaPrediccion] = useState<string>(fechasPrediccionPredefinidas[0]);
  const [rangoPrediccion, setRangoPrediccion] = useState<RangoFechas>({
    inicio: fechasPrediccionPredefinidas[0],
    fin: fechasPrediccionPredefinidas[6]
  });
  const [fechasDisponibles, setFechasDisponibles] = useState<string[]>(fechasPrediccionPredefinidas);
  const [isMounted, setIsMounted] = useState(false);

  // Solo ejecutar en el cliente para evitar problemas de hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Obtener datos del sensor seleccionado
  const datosSensor = sensorData[sensorSeleccionado];

  // Generar datos de predicción simulados (sin Math.random en el render inicial)
  const generarDatosPrediccion = (): SensorDato[] => {
    const datos: SensorDato[] = [];
    const fechas: string[] = [];
    
    if (tipoPrediccion === 'dia') {
      fechas.push(fechaPrediccion);
    } else {
      // Generar todas las fechas en el rango
      const inicio = new Date(rangoPrediccion.inicio);
      const fin = new Date(rangoPrediccion.fin);
      const diffTime = Math.abs(fin.getTime() - inicio.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      // Limitar a 60 días máximo
      const diasLimitados = Math.min(diffDays, 60);
      
      for (let i = 0; i < diasLimitados; i++) {
        const fecha = new Date(inicio);
        fecha.setDate(inicio.getDate() + i);
        fechas.push(fecha.toISOString().split('T')[0]);
      }
    }

    // Generar datos para cada fecha
    fechas.forEach(fecha => {
      const horas = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
      
      // Usar un seed basado en la fecha para tener valores consistentes
      const seed = parseInt(fecha.replace(/-/g, '')) % 100;
      
      horas.forEach((hora, horaIndex) => {
        // Usar valor determinístico basado en seed y horaIndex
        const ultimoValor = datosSensor.datos[datosSensor.datos.length - 1]?.valor || 0;
        const variacion = ((seed + horaIndex) % 10) - 5; // Variación determinística entre -5 y +5
        
        datos.push({
          fecha,
          hora,
          valor: 0, // En predicciones no tenemos valor real
          prediccion: Math.max(0, ultimoValor + variacion)
        });
      });
    });

    return datos;
  };

  const datosPrediccion = isMounted ? generarDatosPrediccion() : [];

  // Calcular métricas básicas para las predicciones
  const calcularMetricasPrediccion = (): MetricasRango => {
    if (datosPrediccion.length === 0) {
      return { promedioPrediccion: "0", rangoPrediccion: "0-0", muestras: 0 };
    }

    const predicciones = datosPrediccion.map(item => item.prediccion);
    const sumaPrediccion = predicciones.reduce((acc, val) => acc + val, 0);
    const promedioPrediccion = sumaPrediccion / datosPrediccion.length;
    const minPrediccion = Math.min(...predicciones);
    const maxPrediccion = Math.max(...predicciones);

    return {
      promedioPrediccion: promedioPrediccion.toFixed(1),
      rangoPrediccion: `${minPrediccion.toFixed(1)}-${maxPrediccion.toFixed(1)}`,
      muestras: datosPrediccion.length
    };
  };

  const metricasPrediccion = isMounted ? calcularMetricasPrediccion() : {
    promedioPrediccion: "0",
    rangoPrediccion: "0-0",
    muestras: 0
  };

  // Calcular diferencia de días en el rango
  const calcularDiasRango = (): number => {
    if (tipoPrediccion === 'dia') return 1;
    
    const inicio = new Date(rangoPrediccion.inicio);
    const fin = new Date(rangoPrediccion.fin);
    const diffTime = Math.abs(fin.getTime() - inicio.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const diasRango = isMounted ? calcularDiasRango() : 1;

  // Formatear fecha de manera segura
  const formatearFecha = (fechaStr: string): string => {
    try {
      const fecha = new Date(fechaStr);
      // Usar locale fijo para evitar diferencias entre servidor/cliente
      return fecha.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return fechaStr;
    }
  };

  // Obtener todas las claves de sensores
  const sensoresDisponibles: SensorType[] = Object.keys(sensorData) as SensorType[];

  // Manejar cambio de rango
  const handleRangoChange = (campo: keyof RangoFechas, valor: string) => {
    const nuevoRango = { ...rangoPrediccion, [campo]: valor };
    
    // Validar que la fecha de inicio no sea mayor que la de fin
    if (campo === 'inicio' && nuevoRango.fin && nuevoRango.inicio > nuevoRango.fin) {
      nuevoRango.fin = nuevoRango.inicio;
    }
    
    // Limitar a máximo 60 días
    if (nuevoRango.inicio && nuevoRango.fin) {
      const inicio = new Date(nuevoRango.inicio);
      const fin = new Date(nuevoRango.fin);
      const diffTime = Math.abs(fin.getTime() - inicio.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      if (diffDays > 60) {
        // Ajustar automáticamente a 60 días desde inicio
        const fechaAjustada = new Date(inicio);
        fechaAjustada.setDate(inicio.getDate() + 59);
        nuevoRango.fin = fechaAjustada.toISOString().split('T')[0];
      }
    }
    
    setRangoPrediccion(nuevoRango);
  };

  // Si no está montado, mostrar skeleton
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-1/3 mb-4"></div>
            <div className="h-32 bg-slate-800/30 rounded-xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="h-64 bg-slate-800/30 rounded-xl"></div>
              <div className="h-64 bg-slate-800/30 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950">
      

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Selectores principales */}
        <div className="mb-8 bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
          <h2 className="text-lg font-semibold text-white mb-4">Configurar Predicción</h2>
          
          {/* Selector de Sensor */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">Tipo de Sensor</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {sensoresDisponibles.map((sensorKey) => {
                const sensor = sensorData[sensorKey];
                return (
                  <button
                    key={sensorKey}
                    onClick={() => setSensorSeleccionado(sensorKey)}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                      sensorSeleccionado === sensorKey
                        ? `bg-gradient-to-r ${sensor.color} text-white shadow-lg`
                        : 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300'
                    }`}
                  >
                    <span className="text-2xl">{sensor.icono}</span>
                    <div className="text-left">
                      <p className="font-medium">{sensor.nombre}</p>
                      <p className="text-sm opacity-80">Precisión: {(sensor.metricas.presicion * 100).toFixed(1)}%</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selector de Tipo de Predicción */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">Tipo de Predicción</label>
            <div className="flex gap-3">
              <button
                onClick={() => setTipoPrediccion('dia')}
                className={`flex-1 py-3 px-4 rounded-lg transition-all ${
                  tipoPrediccion === 'dia'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                    : 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300'
                }`}
              >
                📅 Día Específico
              </button>
              <button
                onClick={() => setTipoPrediccion('rango')}
                className={`flex-1 py-3 px-4 rounded-lg transition-all ${
                  tipoPrediccion === 'rango'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                    : 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300'
                }`}
              >
                📊 Rango de Días (máx. 60)
              </button>
            </div>
          </div>

          {/* Selectores de Fecha según el tipo */}
          {tipoPrediccion === 'dia' ? (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Seleccionar Día para Predicción
              </label>
              <select
                value={fechaPrediccion}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                  setFechaPrediccion(e.target.value)
                }
                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                {fechasDisponibles.map(fecha => (
                  <option key={`pred-${fecha}`} value={fecha} className="bg-slate-800">
                    {formatearFecha(fecha)}
                  </option>
                ))}
              </select>
              <div className="mt-2 text-sm text-cyan-400">
                <p>📋 Predicción generada para: {formatearFecha(fechaPrediccion)}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Fecha de Inicio
                </label>
                <select
                  value={rangoPrediccion.inicio}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    handleRangoChange('inicio', e.target.value)
                  }
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  {fechasDisponibles.map(fecha => (
                    <option key={`inicio-${fecha}`} value={fecha} className="bg-slate-800">
                      {formatearFecha(fecha)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Fecha de Fin
                </label>
                <select
                  value={rangoPrediccion.fin}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    handleRangoChange('fin', e.target.value)
                  }
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  disabled={!rangoPrediccion.inicio}
                >
                  {fechasDisponibles
                    .filter(fecha => fecha >= rangoPrediccion.inicio)
                    .slice(0, 60) // Limitar a máximo 60 días desde inicio
                    .map(fecha => (
                      <option key={`fin-${fecha}`} value={fecha} className="bg-slate-800">
                        {formatearFecha(fecha)}
                      </option>
                    ))}
                </select>
              </div>
              
              {rangoPrediccion.inicio && rangoPrediccion.fin && (
                <div className="md:col-span-2">
                  <div className={`mt-2 p-3 rounded-lg ${
                    diasRango > 60 ? 'bg-red-900/30 border border-red-700/50' : 'bg-cyan-900/30 border border-cyan-700/50'
                  }`}>
                    <p className={`text-sm ${diasRango > 60 ? 'text-red-300' : 'text-cyan-300'}`}>
                      📊 Rango seleccionado: {diasRango} día{diasRango !== 1 ? 's' : ''} • 
                      Del {formatearFecha(rangoPrediccion.inicio)} al {formatearFecha(rangoPrediccion.fin)}
                      {diasRango > 60 && ' ⚠️ (Máximo 60 días permitido)'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botón para generar predicción */}
          <div className="mt-6">
            <button 
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl"
              onClick={() => {
                console.log('Generando predicción para:', {
                  sensor: sensorSeleccionado,
                  tipoPrediccion,
                  fechaPrediccion,
                  rangoPrediccion
                });
              }}
            >
              🚀 Generar Predicción
            </button>
          </div>
        </div>

        {/* Resultados de Predicción */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-4 rounded-xl bg-gradient-to-r ${datosSensor.color}`}>
              <span className="text-3xl">{datosSensor.icono}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{datosSensor.nombre}</h2>
              <p className="text-slate-400">
                {tipoPrediccion === 'dia' 
                  ? `Predicción generada para el ${formatearFecha(fechaPrediccion)}`
                  : `Predicción generada para el rango del ${formatearFecha(rangoPrediccion.inicio)} al ${formatearFecha(rangoPrediccion.fin)}`
                }
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Panel de Métricas del Modelo */}
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-6">Confianza del Modelo</h3>
              
              <MetricBar 
                value={datosSensor.metricas.presicion} 
                label="Precisión" 
              />
              
              <MetricBar 
                value={datosSensor.metricas.recall} 
                label="Recall" 
              />
              
              <MetricBar 
                value={datosSensor.metricas.f1score} 
                label="F1-Score" 
              />

              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Muestras de entrenamiento:</span>
                  <span className="text-xl font-bold text-white">
                    {datosSensor.metricas.support.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Panel de Resumen de Predicción */}
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-6">
                Resumen de Predicción
              </h3>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <p className="text-sm text-slate-400 mb-1">Período</p>
                    <p className="text-2xl font-bold text-white">
                      {tipoPrediccion === 'dia' ? '1 día' : `${diasRango} días`}
                    </p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <p className="text-sm text-slate-400 mb-1">Predicción Promedio</p>
                    <p className="text-2xl font-bold text-cyan-400">
                      {metricasPrediccion.promedioPrediccion} {datosSensor.unidad}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Registros generados</p>
                      <p className="text-xl font-bold text-white">
                        {metricasPrediccion.muestras}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-400 mb-1">Rango de valores</p>
                      <p className="text-xl font-bold text-white">
                        {metricasPrediccion.rangoPrediccion} {datosSensor.unidad}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700/50">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Notas sobre la predicción</h4>
                  <ul className="text-sm text-slate-400 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">📈</span>
                      <span>Predicciones basadas en datos históricos del sensor</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">⚠️</span>
                      <span>Los valores pueden variar según condiciones reales</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✅</span>
                      <span>Modelo entrenado con {datosSensor.metricas.support.toLocaleString()} muestras</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">📅</span>
                      <span>Intervalo de muestreo: cada 4 horas</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Predicciones */}
        {datosPrediccion.length > 0 && (
          <div className="bg-slate-800/30 rounded-xl overflow-hidden border border-slate-700/50">
            <div className="px-6 py-4 border-b border-slate-700/50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-white">Predicciones Detalladas</h3>
                  <p className="text-sm text-slate-400">
                    {tipoPrediccion === 'dia' 
                      ? formatearFecha(fechaPrediccion)
                      : `${formatearFecha(rangoPrediccion.inicio)} - ${formatearFecha(rangoPrediccion.fin)}`
                    }
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-cyan-900/30 text-cyan-300 rounded-full text-sm">
                    {datosPrediccion.length} predicciones
                  </span>
                  <button className="px-3 py-1 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 rounded-lg text-sm transition-colors">
                    📥 Exportar
                  </button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-900/50">
                    <th className="py-3 px-6 text-left text-sm font-medium text-slate-300">Fecha</th>
                    <th className="py-3 px-6 text-left text-sm font-medium text-slate-300">Hora</th>
                    <th className="py-3 px-6 text-left text-sm font-medium text-slate-300">Predicción ({datosSensor.unidad})</th>
                    <th className="py-3 px-6 text-left text-sm font-medium text-slate-300">Confianza</th>
                    <th className="py-3 px-6 text-left text-sm font-medium text-slate-300"></th>
                    <th className="py-3 px-6 text-left text-sm font-medium text-slate-300">Notas</th>
                  </tr>
                </thead>
                <tbody>
                  {datosPrediccion.slice(0, 100).map((item, index) => { // Limitar a 100 filas para rendimiento
                    // Calcular confianza basada en métricas del modelo
                    const confianza = datosSensor.metricas.f1score * 100;
                    let confianzaColor = 'bg-green-900/30 text-green-400';
                    let confianzaTexto = 'Alta';
                    
                    if (confianza < 85) {
                      confianzaColor = 'bg-yellow-900/30 text-yellow-400';
                      confianzaTexto = 'Media';
                    } else if (confianza < 75) {
                      confianzaColor = 'bg-red-900/30 text-red-400';
                      confianzaTexto = 'Baja';
                    }

                    // Determinar tendencia basada en posición (no aleatoria)
                    const tendenciaIndex = (index % 3);
                    let tendencia = '→';
                    let tendenciaColor = 'bg-blue-900/30 text-blue-400';
                    let tendenciaTexto = 'Estable';
                    
                    if (tendenciaIndex === 0) {
                      tendencia = '↑';
                      tendenciaColor = 'bg-emerald-900/30 text-emerald-400';
                      tendenciaTexto = 'En aumento';
                    } else if (tendenciaIndex === 1) {
                      tendencia = '↓';
                      tendenciaColor = 'bg-orange-900/30 text-orange-400';
                      tendenciaTexto = 'En descenso';
                    }

                    return (
                      <tr key={index} className="border-b border-slate-700/30 hover:bg-slate-800/20">
                        <td className="py-3 px-6 text-slate-300">
                          {new Date(item.fecha).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-3 px-6 text-slate-300">{item.hora}</td>
                        <td className="py-3 px-6">
                          <span className="text-cyan-400 font-bold text-lg">{item.prediccion.toFixed(1)}</span>
                          <span className="text-sm text-slate-400 ml-1">{datosSensor.unidad}</span>
                        </td>
                        <td className="py-3 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${confianzaColor}`}>
                            {confianzaTexto} ({confianza.toFixed(1)}%)
                          </span>
                        </td>
                        <td className="py-3 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${tendenciaColor}`}>
                            {tendencia} {tendenciaTexto}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-sm text-slate-400">
                          {item.hora === '12:00' ? '📊 Pico del día' : 
                           item.hora === '00:00' ? '🌙 Inicio del día' :
                           item.hora === '20:00' ? '🌆 Final del día' : '📈 Predicción normal'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {datosPrediccion.length > 100 && (
                <div className="px-6 py-4 bg-slate-900/50 text-center">
                  <p className="text-sm text-slate-400">
                    Mostrando 100 de {datosPrediccion.length} predicciones. Usa filtros para ver más datos.
                  </p>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 bg-slate-900/50 text-sm text-slate-400">
              <p>⚠️ Nota: Estas son predicciones generadas por el modelo. Los valores reales pueden variar.</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400 text-sm">
              © 2023 Sistema de Predicciones de Sensores • Modo de predicción activo
            </div>
            <div className="text-sm text-slate-400">
              Última actualización del modelo: {datosSensor.metricas.ultimaActualizacion}
            </div>
          </div>
        </div>
      </footer>
    </div>
      </AuthGuard>
  );
}