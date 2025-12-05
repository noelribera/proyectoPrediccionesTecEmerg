"use client"

import { useState } from "react"
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, TrendingUp, Wind, Bell, Settings, ChevronLeft, Download, Share2, AlertTriangle } from "lucide-react"

// Mock detailed sensor data
const sensorDetail = {
  id: "sensor-001",
  name: "Zona A - Temperatura",
  location: "Sector Centro",
  status: "normal",
  currentValue: "24.7°C",
  unit: "°C",
  minThreshold: 18,
  maxThreshold: 28,
  average: "23.5°C",
  min: "21.2°C",
  max: "26.8°C",
  lastUpdate: "hace 2 segundos",
}

const detailedChartData = [
  { time: "00:00", value: 22, min: 20, max: 25 },
  { time: "04:00", value: 21, min: 19, max: 24 },
  { time: "08:00", value: 23, min: 21, max: 26 },
  { time: "12:00", value: 25, min: 23, max: 28 },
  { time: "16:00", value: 26, min: 24, max: 29 },
  { time: "20:00", value: 24, min: 22, max: 27 },
  { time: "24:00", value: 23, min: 21, max: 26 },
]

const events = [
  { id: 1, type: "threshold", message: "Temperatura superó 26°C", time: "14:32", severity: "warning" },
  { id: 2, type: "update", message: "Lectura actualizada", time: "14:30", severity: "info" },
  { id: 3, type: "threshold", message: "Temperatura bajó a 21°C", time: "14:28", severity: "info" },
]

export default function SensorDetailPage({ params }: { params: { id: string } }) {
  const [timeRange, setTimeRange] = useState("24h")
  const [showThresholds, setShowThresholds] = useState(true)

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">{sensorDetail.name}</h1>
              <p className="text-sm text-slate-400">{sensorDetail.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <Download className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Current Value Card */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-700 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-slate-400 text-sm mb-2">Valor Actual</p>
              <p className="text-5xl font-bold text-white">{sensorDetail.currentValue}</p>
              <p className="text-slate-400 text-sm mt-2">{sensorDetail.lastUpdate}</p>
            </div>
            <div
              className={`px-4 py-2 rounded-lg ${sensorDetail.status === "normal" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}
            >
              <p className="text-sm font-semibold capitalize">{sensorDetail.status}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-slate-400 text-xs mb-1">Promedio</p>
              <p className="text-xl font-bold text-white">{sensorDetail.average}</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-slate-400 text-xs mb-1">Mínimo</p>
              <p className="text-xl font-bold text-blue-400">{sensorDetail.min}</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-slate-400 text-xs mb-1">Máximo</p>
              <p className="text-xl font-bold text-red-400">{sensorDetail.max}</p>
            </div>
          </div>
        </Card>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {["2h", "24h", "7d", "30d", "1y"].map((range) => (
            <Button
              key={range}
              variant={range === timeRange ? "default" : "outline"}
              onClick={() => setTimeRange(range)}
              className={
                range === timeRange
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "border-slate-600 text-slate-300 hover:bg-slate-800"
              }
            >
              {range}
            </Button>
          ))}
        </div>

        {/* Main Chart */}
        <Card className="bg-slate-800 border-slate-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Historial de Lecturas</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowThresholds(!showThresholds)}
              className={`text-xs ${showThresholds ? "text-blue-400" : "text-slate-400"}`}
            >
              {showThresholds ? "Ocultar" : "Mostrar"} Umbrales
            </Button>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={detailedChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={3} dot={false} name="Temperatura" />
              {showThresholds && (
                <>
                  <Line
                    type="monotone"
                    dataKey="min"
                    stroke="#3b82f6"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Mínimo"
                  />
                  <Line
                    type="monotone"
                    dataKey="max"
                    stroke="#ef4444"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Máximo"
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        {/* Threshold Configuration */}
        <Card className="bg-slate-800 border-slate-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Configuración de Umbrales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Umbral Mínimo</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={sensorDetail.minThreshold}
                  className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                />
                <span className="text-slate-400">°C</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Umbral Máximo</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={sensorDetail.maxThreshold}
                  className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                />
                <span className="text-slate-400">°C</span>
              </div>
            </div>
          </div>

          <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">Guardar Cambios</Button>
        </Card>

        {/* Events Timeline */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Historial de Eventos</h3>

          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="flex items-start gap-4 pb-3 border-b border-slate-700 last:border-0">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    event.severity === "warning"
                      ? "bg-yellow-500"
                      : event.severity === "error"
                        ? "bg-red-500"
                        : "bg-blue-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{event.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 md:hidden">
        <div className="flex items-center justify-around">
          {[
            { icon: Activity, label: "Home" },
            { icon: TrendingUp, label: "Tiempo Real" },
            { icon: Wind, label: "Insights" },
            { icon: Bell, label: "Alertas" },
            { icon: Settings, label: "Cuenta" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex-1 flex flex-col items-center justify-center py-3 text-slate-400 hover:text-white hover:bg-slate-700/50"
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Padding for mobile nav */}
      <div className="h-20 md:h-0" />
    </div>
  )
}
