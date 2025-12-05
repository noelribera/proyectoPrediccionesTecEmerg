"use client"

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Droplets, Wind, Activity, Bell } from "lucide-react"
import AuthGuard from "@/components/AuthGuard"
import Link from "next/link"

// Mock data
const kpiData = [
  { label: "Temperatura", value: "24.7°C", unit: "C", trend: "+2.3%", icon: TrendingUp, color: "bg-orange-500" },
  { label: "Humedad", value: "65%", unit: "%", trend: "-1.2%", icon: Droplets, color: "bg-blue-500" },
  { label: "CO₂", value: "420 ppm", unit: "ppm", trend: "+0.8%", icon: Wind, color: "bg-green-500" },
  { label: "Alertas", value: "3", unit: "activas", trend: "crítica", icon: Activity, color: "bg-red-500" },
]

const chartData = [
  { time: "00:00", temp: 22, humidity: 60 },
  { time: "04:00", temp: 21, humidity: 62 },
  { time: "08:00", temp: 23, humidity: 58 },
  { time: "12:00", temp: 25, humidity: 55 },
  { time: "16:00", temp: 26, humidity: 52 },
  { time: "20:00", temp: 24, humidity: 60 },
  { time: "24:00", temp: 23, humidity: 63 },
]

const alerts = [
  { id: 1, sensor: "Zona A - Temperatura", message: "Temperatura > 28°C", severity: "high", time: "hace 5 min" },
  { id: 2, sensor: "Zona B - CO₂", message: "CO₂ > 500 ppm", severity: "medium", time: "hace 15 min" },
  { id: 3, sensor: "Zona C - Humedad", message: "Humedad < 40%", severity: "low", time: "hace 1 hora" },
]

export default function HomePage() {
  return (
  <AuthGuard>
    <div className="min-h-screen bg-slate-900">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Time Range Selector */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">Dashboard</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpiData.map((kpi) => {
            const Icon = kpi.icon
            return (
              <Card key={kpi.label} className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${kpi.color} p-3 rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span
                    className={`text-xs font-semibold ${kpi.trend === "crítica" ? "text-red-400" : "text-green-400"}`}
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Temperature Chart */}
          <Card className="bg-slate-800 border-slate-700 p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">Temperatura (últimas 24h)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Line type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Humidity Chart */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Humedad</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Bar dataKey="humidity" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Alerts Section */}
        {/* <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-400" />
              Alertas Activas
            </h3>
            <Link href="/alerts">
              <Button variant="ghost" className="text-blue-400 hover:text-blue-300 text-sm">
                Ver todas
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    alert.severity === "high"
                      ? "bg-red-500"
                      : alert.severity === "medium"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{alert.sensor}</p>
                  <p className="text-xs text-slate-400">{alert.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  Reconocer
                </Button>
              </div>
            ))}
          </div>
        </Card> */}
      </main>
    </div>
    </AuthGuard>
  )
}
