"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AuthGuard from "@/components/AuthGuard"
import { RefreshCw } from "lucide-react"

// Mock real-time data
const generateRealtimeData = () => [
  {
    id: 1,
    sensor: "Zona A - Temperatura",
    value: "24.7°C",
    unit: "C",
    status: "normal",
    timestamp: "14:32:45",
    trend: "+0.2°C",
  },
  {
    id: 2,
    sensor: "Zona A - Humedad",
    value: "65%",
    unit: "%",
    status: "normal",
    timestamp: "14:32:44",
    trend: "-1.2%",
  },
  {
    id: 3,
    sensor: "Zona B - CO₂",
    value: "420 ppm",
    unit: "ppm",
    status: "warning",
    timestamp: "14:32:43",
    trend: "+5 ppm",
  },
  {
    id: 4,
    sensor: "Zona B - Sonido",
    value: "72 dB",
    unit: "dB",
    status: "normal",
    timestamp: "14:32:42",
    trend: "-2 dB",
  },
  {
    id: 5,
    sensor: "Zona C - Temperatura",
    value: "26.1°C",
    unit: "C",
    status: "critical",
    timestamp: "14:32:41",
    trend: "+1.5°C",
  },
  {
    id: 6,
    sensor: "Zona C - Humedad",
    value: "38%",
    unit: "%",
    status: "warning",
    timestamp: "14:32:40",
    trend: "-3.2%",
  },
]

const chartData = [
  { time: "14:00", temp: 23, humidity: 62, co2: 410 },
  { time: "14:10", temp: 23.5, humidity: 63, co2: 415 },
  { time: "14:20", temp: 24, humidity: 64, co2: 418 },
  { time: "14:30", temp: 24.7, humidity: 65, co2: 420 },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "critical":
      return "bg-red-500/20 border-red-500/50 text-red-400"
    case "warning":
      return "bg-yellow-500/20 border-yellow-500/50 text-yellow-400"
    default:
      return "bg-green-500/20 border-green-500/50 text-green-400"
  }
}

const getStatusDot = (status: string) => {
  switch (status) {
    case "critical":
      return "bg-red-500"
    case "warning":
      return "bg-yellow-500"
    default:
      return "bg-green-500"
  }
}

export default function RealtimePage() {
  const [data, setData] = useState(generateRealtimeData())
  const [isLive, setIsLive] = useState(true)

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setData((prevData) =>
        prevData.map((item) => ({
          ...item,
          value: `${(Math.random() * 30 + 20).toFixed(1)}${item.unit}`,
          timestamp: new Date().toLocaleTimeString(),
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  return (
    <AuthGuard>
    <div className="min-h-screen bg-slate-900">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Tiempo Real</h1>
          <p className="text-sm text-slate-400">Lecturas en vivo de sensores</p>
        </div>

        {/* Live Chart */}
        <Card className="bg-slate-800 border-slate-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Gráfico en Vivo (últimos 30 min)</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLive(!isLive)}
              className={`${isLive ? "text-green-400" : "text-slate-400"} hover:text-white`}
            >
              <RefreshCw className={`w-5 h-5 ${isLive ? "animate-spin" : ""}`} />
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Line type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={2} dot={false} name="Temperatura" />
              <Line type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={2} dot={false} name="Humedad" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Real-time Sensor List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Lecturas Activas</h2>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${isLive ? "bg-green-500/20 text-green-400" : "bg-slate-700 text-slate-400"}`}
            >
              {isLive ? "EN VIVO" : "PAUSADO"}
            </span>
          </div>

          {data.map((reading) => (
            <Card
              key={reading.id}
              className={`border p-4 cursor-pointer transition-all hover:border-blue-500/50 ${getStatusColor(reading.status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-3 h-3 rounded-full mt-1.5 ${getStatusDot(reading.status)}`} />
                  <div className="flex-1">
                    <p className="font-medium text-white">{reading.sensor}</p>
                    <p className="text-sm text-slate-300 mt-1">
                      Valor: <span className="font-semibold">{reading.value}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{reading.timestamp}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{reading.value}</p>
                  <p
                    className={`text-xs font-semibold mt-1 ${reading.trend.startsWith("+") ? "text-red-400" : "text-green-400"}`}
                  >
                    {reading.trend}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
    </AuthGuard>
  )
}
