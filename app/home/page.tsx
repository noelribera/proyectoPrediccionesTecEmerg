"use client"

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Thermometer, Droplets, Waves } from "lucide-react"
import AuthGuard from "@/components/AuthGuard"

// Mock data actualizado para incluir sensores soterrados
const kpiData = [
  { label: "Temperatura", value: "24.7°C", unit: "C", trend: "+2.3%", icon: Thermometer, color: "bg-orange-500" },
  { label: "Humedad", value: "65%", unit: "%", trend: "-1.2%", icon: Droplets, color: "bg-blue-500" },
  { label: "Soterrados", value: "28.5°C", unit: "C", trend: "+0.8%", icon: Waves, color: "bg-green-500" },
]

// Datos para temperatura (sensores de temperatura)
const temperatureData = [
  { time: "00:00", sensorA: 22, sensorB: 20, sensorC: 21 },
  { time: "04:00", sensorA: 21, sensorB: 19, sensorC: 20 },
  { time: "08:00", sensorA: 23, sensorB: 22, sensorC: 24 },
  { time: "12:00", sensorA: 25, sensorB: 24, sensorC: 26 },
  { time: "16:00", sensorA: 26, sensorB: 25, sensorC: 27 },
  { time: "20:00", sensorA: 24, sensorB: 23, sensorC: 25 },
  { time: "24:00", sensorA: 23, sensorB: 22, sensorC: 24 },
]

// Datos para humedad (sensores de humedad)
const humidityData = [
  { time: "00:00", sensorD: 60, sensorE: 58, sensorF: 62 },
  { time: "04:00", sensorD: 62, sensorE: 60, sensorF: 64 },
  { time: "08:00", sensorD: 58, sensorE: 56, sensorF: 60 },
  { time: "12:00", sensorD: 55, sensorE: 53, sensorF: 57 },
  { time: "16:00", sensorD: 52, sensorE: 50, sensorF: 54 },
  { time: "20:00", sensorD: 60, sensorE: 58, sensorF: 62 },
  { time: "24:00", sensorD: 63, sensorE: 61, sensorF: 65 },
]

// Datos para sensores soterrados (temperatura del suelo)
const buriedSensorsData = [
  { time: "00:00", profundidad10cm: 18, profundidad30cm: 16, profundidad50cm: 14 },
  { time: "04:00", profundidad10cm: 17, profundidad30cm: 15, profundidad50cm: 13 },
  { time: "08:00", profundidad10cm: 20, profundidad30cm: 18, profundidad50cm: 16 },
  { time: "12:00", profundidad10cm: 24, profundidad30cm: 21, profundidad50cm: 19 },
  { time: "16:00", profundidad10cm: 25, profundidad30cm: 22, profundidad50cm: 20 },
  { time: "20:00", profundidad10cm: 22, profundidad30cm: 20, profundidad50cm: 18 },
  { time: "24:00", profundidad10cm: 19, profundidad30cm: 17, profundidad50cm: 15 },
]

export default function HomePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-900">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          {/* Time Range Selector */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">Dashboard de Sensores</h1>
            <p className="text-sm text-slate-400 mb-4">Bienvenido, Ejecutivo</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {["2h", "24h", "7d", "30d", "1y"].map((range) => (
                <Button
                  key={range}
                  variant={range === "24h" ? "default" : "outline"}
                  className={
                    range === "24h"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "border-slate-600 text-slate-300 hover:bg-slate-800"
                  }
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {kpiData.map((kpi) => {
              const Icon = kpi.icon
              return (
                <Card key={kpi.label} className="bg-slate-800 border-slate-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${kpi.color} p-3 rounded-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span
                      className={`text-xs font-semibold ${kpi.trend.includes("+") ? "text-green-400" : "text-red-400"}`}
                    >
                      {kpi.trend}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-1">{kpi.label}</p>
                  <p className="text-2xl font-bold text-white">{kpi.value}</p>
                </Card>
              )
            })}
          </div>

          {/* Charts Section - 3 gráficos en grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gráfico 1: Sensores de Temperatura */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Sensores de Temperatura</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" label={{ value: '°C', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Line type="monotone" dataKey="sensorA" name="Sensor A" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="sensorB" name="Sensor B" stroke="#fbbf24" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="sensorC" name="Sensor C" stroke="#fb923c" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Gráfico 2: Sensores de Humedad */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Sensores de Humedad</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={humidityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" label={{ value: '%', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Bar dataKey="sensorD" name="Sensor D" fill="#3b82f6" />
                  <Bar dataKey="sensorE" name="Sensor E" fill="#60a5fa" />
                  <Bar dataKey="sensorF" name="Sensor F" fill="#93c5fd" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Gráfico 3: Sensores Soterrados */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Sensores Soterrados</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={buriedSensorsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" label={{ value: '°C', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Area type="monotone" dataKey="profundidad10cm" name="Prof. 10cm" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="profundidad30cm" name="Prof. 30cm" stroke="#059669" fill="#059669" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="profundidad50cm" name="Prof. 50cm" stroke="#047857" fill="#047857" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}