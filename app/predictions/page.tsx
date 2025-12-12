"use client"

import { useState, useEffect } from "react"
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area, RadarChart, 
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart,
  Scatter, Legend
} from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Thermometer, Droplets, Waves, Activity, Volume2, CloudRain, 
  Brain, Zap, BarChart3, Target, TrendingUp, Cpu, AlertCircle,
  CheckCircle, XCircle, RefreshCw, Calendar, Download,
  Shield, Battery, Clock, Database
} from "lucide-react"
import AuthGuard from "@/components/AuthGuard"
import { apiClient } from "@/lib/api/client"
import { TrainingResult, PredictionResult } from "@/lib/api/models"
import { transformPredictionsForChart } from "@/lib/api/utils"
// import {useHealthCheck, useMLTraining, usePredictions} from "../../hooks/useAPI"
import { useHealthCheck, useMLTraining, usePredictions } from "@/hooks/useApi"

// Colores temáticos para cada sensor
const SENSOR_CONFIG = {
  air: {
    label: "Calidad del Aire",
    color: "orange",
    icon: Activity,
    bgColor: "bg-orange-500",
    borderColor: "border-orange-500",
    textColor: "text-orange-500",
    chartColor: "#f97316",
    lightColor: "bg-orange-500/10",
  },
  sound: {
    label: "Nivel de Sonido", 
    color: "blue",
    icon: Volume2,
    bgColor: "bg-blue-500",
    borderColor: "border-blue-500",
    textColor: "text-blue-500",
    chartColor: "#3b82f6",
    lightColor: "bg-blue-500/10",
  },
  water: {
    label: "Nivel de Agua",
    color: "green",
    icon: CloudRain,
    bgColor: "bg-green-500",
    borderColor: "border-green-500",
    textColor: "text-green-500",
    chartColor: "#10b981",
    lightColor: "bg-green-500/10",
  }
} as const

// Opciones de días para predicción
const PREDICTION_DAYS_OPTIONS = [7, 14, 30]

export default function MLTrainingPage() {
  const [selectedSensor, setSelectedSensor] = useState<'air' | 'sound' | 'water'>('air')
  const [predictionDays, setPredictionDays] = useState<number>(7)
  const [trainingResults, setTrainingResults] = useState<Record<string, TrainingResult | null>>({
    air: null,
    sound: null,
    water: null
  })
  const [predictionResults, setPredictionResults] = useState<Record<string, PredictionResult | null>>({
    air: null,
    sound: null,
    water: null
  })
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({
    air: false,
    sound: false,
    water: false
  })

  // Hooks para cada sensor
  const { train: trainAir, data: airTrainingResult, loading: airTrainingLoading } = useMLTraining('air')
  const { train: trainSound, data: soundTrainingResult, loading: soundTrainingLoading } = useMLTraining('sound')
  const { train: trainWater, data: waterTrainingResult, loading: waterTrainingLoading } = useMLTraining('water')

  const { data: airPredictions, loading: airPredictionsLoading } = usePredictions('air', predictionDays)
  const { data: soundPredictions, loading: soundPredictionsLoading } = usePredictions('sound', predictionDays)
  const { data: waterPredictions, loading: waterPredictionsLoading } = usePredictions('water', predictionDays)

  const { data: health } = useHealthCheck()

  // Actualizar resultados de entrenamiento
  useEffect(() => {
    if (airTrainingResult) setTrainingResults(prev => ({ ...prev, air: airTrainingResult }))
    if (soundTrainingResult) setTrainingResults(prev => ({ ...prev, sound: soundTrainingResult }))
    if (waterTrainingResult) setTrainingResults(prev => ({ ...prev, water: waterTrainingResult }))
  }, [airTrainingResult, soundTrainingResult, waterTrainingResult])

  // Actualizar resultados de predicción
  useEffect(() => {
    if (airPredictions) setPredictionResults(prev => ({ ...prev, air: airPredictions }))
    if (soundPredictions) setPredictionResults(prev => ({ ...prev, sound: soundPredictions }))
    if (waterPredictions) setPredictionResults(prev => ({ ...prev, water: waterPredictions }))
  }, [airPredictions, soundPredictions, waterPredictions])

  // Actualizar estados de carga
  useEffect(() => {
    setLoadingStates({
      air: airTrainingLoading,
      sound: soundTrainingLoading,
      water: waterTrainingLoading
    })
  }, [airTrainingLoading, soundTrainingLoading, waterTrainingLoading])

  // Función para entrenar un modelo específico
  const handleTrainModel = async (sensorType: 'air' | 'sound' | 'water') => {
    try {
      let result: TrainingResult | null = null
      
      switch(sensorType) {
        case 'air':
          result = await trainAir()
          break
        case 'sound':
          result = await trainSound()
          break
        case 'water':
          result = await trainWater()
          break
      }

      if (result?.success) {
        // Actualizar resultados automáticamente
        setTrainingResults(prev => ({ ...prev, [sensorType]: result }))
        alert(`✅ Modelo ${SENSOR_CONFIG[sensorType].label} entrenado exitosamente!`)
      }
    } catch (error) {
      console.error("Error entrenando modelo:", error)
      alert("❌ Error entrenando modelo. Verifica la consola para más detalles.")
    }
  }

  // Función para actualizar predicciones
  const handleUpdatePredictions = async (sensorType: 'air' | 'sound' | 'water') => {
    try {
      const result = await apiClient.getPredictions(sensorType, predictionDays)
      if (result.success) {
        setPredictionResults(prev => ({ ...prev, [sensorType]: result }))
        alert(`✅ Predicciones actualizadas para ${SENSOR_CONFIG[sensorType].label}`)
      }
    } catch (error) {
      console.error("Error actualizando predicciones:", error)
    }
  }

  // Función para descargar datos de entrenamiento
  const handleDownloadTrainingData = (sensorType: 'air' | 'sound' | 'water') => {
    const result = trainingResults[sensorType]
    if (!result) return

    const dataStr = JSON.stringify(result, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `modelo_${sensorType}_${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  // Función para obtener color según puntaje R²
  const getScoreColor = (r2: number) => {
    if (r2 >= 0.8) return "text-green-400"
    if (r2 >= 0.6) return "text-yellow-400"
    if (r2 >= 0.4) return "text-orange-400"
    return "text-red-400"
  }

  // Función para obtener etiqueta según puntaje R²
  const getScoreLabel = (r2: number) => {
    if (r2 >= 0.8) return "Excelente"
    if (r2 >= 0.6) return "Bueno"
    if (r2 >= 0.4) return "Aceptable"
    return "Necesita mejora"
  }

  // Función para obtener datos del gráfico de predicción
  const getPredictionChartData = (sensorType: 'air' | 'sound' | 'water') => {
    const result = predictionResults[sensorType]
    if (!result?.success || !result.predictions.length) return []
    
    return transformPredictionsForChart(result.predictions)
  }

  // Función para obtener datos del gráfico radar de métricas
  const getMetricsRadarData = (sensorType: 'air' | 'sound' | 'water') => {
    const result = trainingResults[sensorType]
    if (!result?.success || !result.metrics) return []
    
    const metrics = result.metrics
    return [
      { metric: 'R²', value: metrics.r2 * 100, fullMark: 100 },
      { metric: 'Accuracy', value: (metrics.accuracy || 0) * 100, fullMark: 100 },
      { metric: 'Precision', value: (metrics.precision || 0) * 100, fullMark: 100 },
      { metric: 'Recall', value: (metrics.recall || 0) * 100, fullMark: 100 },
      { metric: 'F1-Score', value: (metrics.f1 || 0) * 100, fullMark: 100 },
    ]
  }

  // Componente para mostrar métricas del modelo
  const ModelMetricsCard = ({ sensorType }: { sensorType: 'air' | 'sound' | 'water' }) => {
    const config = SENSOR_CONFIG[sensorType]
    const result = trainingResults[sensorType]
    const Icon = config.icon
    
    if (!result) {
      return (
        <Card className={`bg-slate-800 border-slate-700 p-6 ${config.lightColor} border-l-4 ${config.borderColor}`}>
          <div className="flex items-center mb-4">
            <div className={`${config.bgColor} p-2 rounded-lg mr-3`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{config.label}</h3>
              <p className="text-slate-400 text-sm">No entrenado aún</p>
            </div>
          </div>
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500">Presiona "Entrenar Modelo" para comenzar</p>
          </div>
        </Card>
      )
    }

    if (!result.success) {
      return (
        <Card className="bg-slate-800 border-red-500/30 border-l-4 border-red-500 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-red-500 p-2 rounded-lg mr-3">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{config.label}</h3>
              <p className="text-red-400 text-sm">Error en entrenamiento</p>
            </div>
          </div>
          <div className="bg-red-500/10 p-4 rounded-lg">
            <p className="text-red-300">{result.error}</p>
          </div>
        </Card>
      )
    }

    const metrics = result.metrics
    const r2Color = getScoreColor(metrics.r2)
    const r2Label = getScoreLabel(metrics.r2)

    return (
      <Card className={`bg-slate-800 border-slate-700 p-6 ${config.lightColor} border-l-4 ${config.borderColor}`}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <div className={`${config.bgColor} p-2 rounded-lg mr-3`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{config.label}</h3>
              <div className="flex items-center mt-1">
                <span className={`text-sm font-bold ${r2Color}`}>R²: {metrics.r2.toFixed(4)}</span>
                <span className="text-slate-400 text-sm ml-2">• {r2Label}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
              onClick={() => handleDownloadTrainingData(sensorType)}
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar
            </Button>
          </div>
        </div>

        {/* Gráfico radar de métricas */}
        <div className="mb-6">
          <h4 className="text-slate-300 text-sm font-medium mb-3">Métricas del Modelo</h4>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={getMetricsRadarData(sensorType)}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={12} />
              <PolarRadiusAxis stroke="#94a3b8" angle={30} domain={[0, 100]} />
              <Radar
                name="Métricas"
                dataKey="value"
                stroke={config.chartColor}
                fill={config.chartColor}
                fillOpacity={0.4}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                labelStyle={{ color: "#e2e8f0" }}
                formatter={(value) => [`${value}%`, "Valor"]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Métricas detalladas */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900/50 p-3 rounded-lg">
            <p className="text-slate-400 text-xs mb-1">MAE</p>
            <p className="text-white font-semibold">{metrics.mae.toFixed(4)}</p>
          </div>
          <div className="bg-slate-900/50 p-3 rounded-lg">
            <p className="text-slate-400 text-xs mb-1">RMSE</p>
            <p className="text-white font-semibold">{metrics.rmse.toFixed(4)}</p>
          </div>
          <div className="bg-slate-900/50 p-3 rounded-lg">
            <p className="text-slate-400 text-xs mb-1">Accuracy</p>
            <p className="text-white font-semibold">
              {metrics.accuracy ? `${(metrics.accuracy * 100).toFixed(1)}%` : "N/A"}
            </p>
          </div>
          <div className="bg-slate-900/50 p-3 rounded-lg">
            <p className="text-slate-400 text-xs mb-1">F1-Score</p>
            <p className="text-white font-semibold">
              {metrics.f1 ? metrics.f1.toFixed(3) : "N/A"}
            </p>
          </div>
        </div>

        {/* Información del dataset */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex justify-between text-sm">
            <div>
              <p className="text-slate-400">Muestras totales</p>
              <p className="text-white font-semibold">{result.samples.total}</p>
            </div>
            <div>
              <p className="text-slate-400">Entrenamiento</p>
              <p className="text-white font-semibold">{result.samples.train}</p>
            </div>
            <div>
              <p className="text-slate-400">Test</p>
              <p className="text-white font-semibold">{result.samples.test}</p>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Componente para mostrar predicciones
  const PredictionCard = ({ sensorType }: { sensorType: 'air' | 'sound' | 'water' }) => {
    const config = SENSOR_CONFIG[sensorType]
    const result = predictionResults[sensorType]
    const chartData = getPredictionChartData(sensorType)
    const loading = 
      (sensorType === 'air' && airPredictionsLoading) ||
      (sensorType === 'sound' && soundPredictionsLoading) ||
      (sensorType === 'water' && waterPredictionsLoading)

    return (
      <Card className="bg-slate-800 border-slate-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className={`${config.bgColor} p-2 rounded-lg mr-3`}>
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Predicciones - {config.label}</h3>
              <p className="text-slate-400 text-sm">Próximos {predictionDays} días</p>
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={predictionDays}
              onChange={(e) => setPredictionDays(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-slate-300 text-sm"
            >
              {PREDICTION_DAYS_OPTIONS.map(days => (
                <option key={days} value={days}>{days} días</option>
              ))}
            </select>
            <Button
              size="sm"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
              onClick={() => handleUpdatePredictions(sensorType)}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-slate-400">Cargando predicciones...</p>
            </div>
          </div>
        ) : !result?.success || !chartData.length ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500">No hay predicciones disponibles</p>
              <p className="text-slate-400 text-sm mt-2">Entrena el modelo primero</p>
            </div>
          </div>
        ) : (
          <>
            {/* Gráfico de predicciones */}
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8" 
                  fontSize={12}
                  tickFormatter={(value) => value.split('/')[0]} // Solo mostrar día
                />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                  labelStyle={{ color: "#e2e8f0" }}
                  formatter={(value: number) => [value.toFixed(2), "Predicción"]}
                />
                <Area
                  type="monotone"
                  dataKey="predicted_value"
                  name="Valor Predicho"
                  stroke={config.chartColor}
                  fill={config.chartColor}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>

            {/* Resumen de predicciones */}
            {result.summary && (
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <p className="text-slate-400 text-xs mb-1">Promedio</p>
                  <p className="text-white font-bold text-xl">{result.summary.avg.toFixed(2)}</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <p className="text-slate-400 text-xs mb-1">Mínimo</p>
                  <p className="text-white font-bold text-xl">{result.summary.min.toFixed(2)}</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <p className="text-slate-400 text-xs mb-1">Máximo</p>
                  <p className="text-white font-bold text-xl">{result.summary.max.toFixed(2)}</p>
                </div>
                <div className={`bg-slate-900/50 p-4 rounded-lg ${
                  result.summary.trend === 'increasing' ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'
                }`}>
                  <p className="text-slate-400 text-xs mb-1">Tendencia</p>
                  <div className="flex items-center">
                    <span className={`text-white font-bold text-xl mr-2 ${
                      result.summary.trend === 'increasing' ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {result.summary.trend === 'increasing' ? '↗' : '↘'}
                    </span>
                    <p className="text-white font-bold text-xl capitalize">{result.summary.trend}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-900">
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Machine Learning - Entrenamiento y Predicción</h1>
                <p className="text-slate-400">
                  Entrena modelos predictivos y genera pronósticos para tus sensores IoT
                </p>
              </div>
              
              {/* Estado de salud API */}
              {health && (
                <div className={`px-4 py-2 rounded-lg flex items-center ${
                  health.status === 'healthy' ? 'bg-green-500/10 border border-green-500/20' : 
                  'bg-red-500/10 border border-red-500/20'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    health.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm text-slate-300">
                    API: {health.status === 'healthy' ? 'Conectada' : 'Problemas'}
                  </span>
                </div>
              )}
            </div>

            {/* Selector de sensor */}
            <div className="flex gap-2 overflow-x-auto pb-2 mt-6">
              {Object.entries(SENSOR_CONFIG).map(([type, config]) => (
                <Button
                  key={type}
                  variant={selectedSensor === type ? "default" : "outline"}
                  className={
                    selectedSensor === type
                      ? `${config.bgColor} hover:opacity-90 text-white`
                      : "border-slate-600 text-slate-300 hover:bg-slate-800"
                  }
                  onClick={() => setSelectedSensor(type as 'air' | 'sound' | 'water')}
                >
                  <config.icon className="w-4 h-4 mr-2" />
                  {config.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Panel de control */}
          <Card className="bg-slate-800 border-slate-700 p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Panel de Control - {SENSOR_CONFIG[selectedSensor].label}
                </h3>
                <p className="text-slate-400 text-sm">
                  {trainingResults[selectedSensor]?.success 
                    ? `Modelo entrenado con ${trainingResults[selectedSensor]?.samples.total} muestras`
                    : 'Modelo no entrenado aún'}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="default"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  onClick={() => handleTrainModel(selectedSensor)}
                  disabled={loadingStates[selectedSensor]}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {loadingStates[selectedSensor] ? (
                    <>
                      <span className="animate-pulse">Entrenando...</span>
                      <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    </>
                  ) : (
                    "Entrenar Modelo"
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="border-purple-600 text-purple-300 hover:bg-purple-900"
                  onClick={() => handleUpdatePredictions(selectedSensor)}
                  disabled={!trainingResults[selectedSensor]?.success}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Generar Predicciones
                </Button>

                <Button
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => {
                    setTrainingResults({ air: null, sound: null, water: null })
                    setPredictionResults({ air: null, sound: null, water: null })
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Limpiar Todo
                </Button>
              </div>
            </div>

            {/* Estadísticas rápidas */}
            {trainingResults[selectedSensor]?.success && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-700">
                <div className="flex items-center">
                  <div className="bg-slate-900 p-2 rounded-lg mr-3">
                    <Database className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Muestras</p>
                    <p className="text-white font-semibold">{trainingResults[selectedSensor]?.samples.total}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-slate-900 p-2 rounded-lg mr-3">
                    <Target className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Precisión (R²)</p>
                    <p className={`font-semibold ${getScoreColor(trainingResults[selectedSensor]?.metrics.r2 || 0)}`}>
                      {(trainingResults[selectedSensor]?.metrics.r2 || 0).toFixed(4)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-slate-900 p-2 rounded-lg mr-3">
                    <Shield className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Error (MAE)</p>
                    <p className="text-white font-semibold">
                      {(trainingResults[selectedSensor]?.metrics.mae || 0).toFixed(4)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-slate-900 p-2 rounded-lg mr-3">
                    <Clock className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Último entrenamiento</p>
                    <p className="text-white font-semibold text-sm">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Sección principal - Métricas y Predicciones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna izquierda: Métricas del modelo */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-orange-400" />
                Métricas del Modelo
              </h2>
              <ModelMetricsCard sensorType={selectedSensor} />
              
              {/* Características importantes */}
              {trainingResults[selectedSensor]?.success && trainingResults[selectedSensor]?.feature_importances && (
                <Card className="bg-slate-800 border-slate-700 p-6 mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Características Importantes</h3>
                  <div className="space-y-3">
                    {Object.entries(trainingResults[selectedSensor]!.feature_importances)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([feature, importance]) => (
                        <div key={feature} className="flex items-center justify-between">
                          <span className="text-slate-300 text-sm truncate">{feature}</span>
                          <div className="flex items-center">
                            <div className="w-32 bg-slate-700 rounded-full h-2 mr-3">
                              <div 
                                className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
                                style={{ width: `${importance * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-white font-semibold text-sm w-10 text-right">
                              {(importance * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Columna derecha: Predicciones */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                Predicciones Futuras
              </h2>
              <PredictionCard sensorType={selectedSensor} />
              
              {/* Gráfico de comparación entre sensores */}
              <Card className="bg-slate-800 border-slate-700 p-6 mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Comparación de Modelos</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={[
                      {
                        sensor: 'Aire',
                        r2: trainingResults.air?.metrics?.r2 || 0,
                        accuracy: trainingResults.air?.metrics?.accuracy || 0,
                      },
                      {
                        sensor: 'Sonido',
                        r2: trainingResults.sound?.metrics?.r2 || 0,
                        accuracy: trainingResults.sound?.metrics?.accuracy || 0,
                      },
                      {
                        sensor: 'Agua',
                        r2: trainingResults.water?.metrics?.r2 || 0,
                        accuracy: trainingResults.water?.metrics?.accuracy || 0,
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="sensor" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" domain={[0, 1]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                      labelStyle={{ color: "#e2e8f0" }}
                      formatter={(value: number) => [value.toFixed(4), "Valor"]}
                    />
                    <Legend />
                    <Bar dataKey="r2" name="R² Score" fill="#f97316" />
                    <Bar dataKey="accuracy" name="Accuracy" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>

          {/* Panel de todos los sensores */}
          <Card className="bg-slate-800 border-slate-700 p-6 mt-8">
            <h3 className="text-lg font-semibold text-white mb-6">Resumen de Todos los Modelos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(SENSOR_CONFIG).map(([type, config]) => {
                const result = trainingResults[type as 'air' | 'sound' | 'water']
                const Icon = config.icon
                
                return (
                  <div 
                    key={type}
                    className={`p-4 rounded-lg border ${config.lightColor} border-l-4 ${config.borderColor} cursor-pointer hover:opacity-90 transition-opacity ${
                      selectedSensor === type ? 'ring-2 ring-white/20' : ''
                    }`}
                    onClick={() => setSelectedSensor(type as 'air' | 'sound' | 'water')}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className={`${config.bgColor} p-2 rounded-lg mr-3`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{config.label}</h4>
                          <p className="text-slate-400 text-sm">
                            {result?.success ? 'Modelo entrenado' : 'No entrenado'}
                          </p>
                        </div>
                      </div>
                      {result?.success && (
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          getScoreColor(result.metrics.r2)
                        }`}>
                          R²: {result.metrics.r2.toFixed(3)}
                        </div>
                      )}
                    </div>
                    
                    {result?.success ? (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-slate-400 text-xs">Muestras</p>
                          <p className="text-white font-semibold">{result.samples.total}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">MAE</p>
                          <p className="text-white font-semibold">{result.metrics.mae.toFixed(3)}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-3">
                        <p className="text-slate-500 text-sm">Presiona para entrenar</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Consejos y recomendaciones */}
          <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30 p-6 mt-8">
            <div className="flex items-start">
              <div className="bg-purple-500/20 p-3 rounded-lg mr-4">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Consejos para Mejorar tus Modelos</h3>
                <ul className="text-slate-300 space-y-2">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></div>
                    <span>Entrena con al menos 100 muestras para mejores resultados</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></div>
                    <span>Un R² mayor a 0.8 indica un modelo excelente</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></div>
                    <span>Actualiza los datos de entrenamiento periódicamente</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></div>
                    <span>Revisa las características importantes para entender tu modelo</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </AuthGuard>
  )
}