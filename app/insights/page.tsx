"use client"

import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Download, Filter, Wind, Activity, Bell, Settings } from "lucide-react"
import { useState } from "react"

// Mock data for comparative analysis
const insightsData = [
  { time: "00:00", zoneA: 22, zoneB: 21, zoneC: 23 },
  { time: "04:00", zoneA: 21, zoneB: 20, zoneC: 22 },
  { time: "08:00", zoneA: 23, zoneB: 22, zoneC: 24 },
  { time: "12:00", zoneA: 25, zoneB: 24, zoneC: 26 },
  { time: "16:00", zoneA: 26, zoneB: 25, zoneC: 27 },
  { time: "20:00", zoneA: 24, zoneB: 23, zoneC: 25 },
  { time: "24:00", zoneA: 23, zoneB: 22, zoneC: 24 },
]

const humidityData = [
  { zone: "Zona A", humidity: 65, co2: 420 },
  { zone: "Zona B", humidity: 58, co2: 380 },
  { zone: "Zona C", humidity: 72, co2: 450 },
]

const sensorTypes = ["Temperatura", "Humedad", "CO₂", "Sonido"]
const timeRanges = ["2h", "24h", "7d", "30d", "1y"]

export default function InsightsPage() {
  const [selectedSensor, setSelectedSensor] = useState("Temperatura")
  const [selectedRange, setSelectedRange] = useState("24h")

  return (
    <div className="min-h-screen bg-slate-900 pb-24">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Análisis</h1>
            <p className="text-sm text-slate-400">Comparativas y tendencias</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters Section */}
        <Card className="bg-slate-800 border-slate-700 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Filtros</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sensor Type Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Tipo de Sensor</label>
              <div className="flex flex-wrap gap-2">
                {sensorTypes.map((sensor) => (
                  <button
                    key={sensor}
                    onClick={() => setSelectedSensor(sensor)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedSensor === sensor
                        ? "bg-blue-600 text-white"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {sensor}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Range Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Rango Temporal</label>
              <div className="flex flex-wrap gap-2">
                {timeRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedRange(range)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedRange === range
                        ? "bg-blue-600 text-white"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Comparative Chart */}
        <Card className="bg-slate-800 border-slate-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Comparativa de Zonas - {selectedSensor}
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={insightsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Legend />
              <Line type="monotone" dataKey="zoneA" stroke="#f97316" strokeWidth={2} name="Zona A" />
              <Line type="monotone" dataKey="zoneB" stroke="#3b82f6" strokeWidth={2} name="Zona B" />
              <Line type="monotone" dataKey="zoneC" stroke="#10b981" strokeWidth={2} name="Zona C" />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Promedio General", value: "24.2°C", change: "+1.2%" },
            { label: "Máximo Registrado", value: "27.5°C", change: "Zona C" },
            { label: "Mínimo Registrado", value: "20.1°C", change: "Zona B" },
          ].map((stat) => (
            <Card key={stat.label} className="bg-slate-800 border-slate-700 p-6">
              <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
              <p className="text-2xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.change}</p>
            </Card>
          ))}
        </div>

        {/* Zone Comparison Table */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Resumen por Zona</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Zona</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Humedad</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">CO₂</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {humidityData.map((row) => (
                  <tr key={row.zone} className="border-b border-slate-700 hover:bg-slate-700/30">
                    <td className="py-3 px-4 text-white font-medium">{row.zone}</td>
                    <td className="py-3 px-4 text-slate-300">{row.humidity}%</td>
                    <td className="py-3 px-4 text-slate-300">{row.co2} ppm</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                        <span className="w-2 h-2 bg-green-400 rounded-full" />
                        Normal
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* Bottom Navigation */}
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
    </div>
  )
}
