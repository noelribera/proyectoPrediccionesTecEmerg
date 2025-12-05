"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, MapPin, Bell, Lock, Eye, LogOut, ChevronRight } from "lucide-react"
import { useState } from "react"

export default function ProfilePage() {
  const [notifications, setNotifications] = useState({
    alerts: true,
    email: true,
    push: false,
    summary: true,
  })

  const [preferences, setPreferences] = useState({
    theme: "dark",
    language: "es",
    timezone: "America/La_Paz",
  })

  const toggleNotification = (key: string) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-24">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-white">Mi Cuenta</h1>
          <p className="text-sm text-slate-400">Gestiona tu perfil y preferencias</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Section */}
        <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">Carlos Mendoza</h2>
              <p className="text-slate-400 text-sm mb-3">Ejecutivo - Gobierno Autónomo Municipal</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">Rol: Ejecutivo</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">Activo</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 border-t border-slate-700 pt-6">
            <div className="flex items-center gap-4">
              <Mail className="w-5 h-5 text-slate-400" />
              <div className="flex-1">
                <p className="text-xs text-slate-500">Correo Electrónico</p>
                <p className="text-white">carlos.mendoza@gamc.gov.bo</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="w-5 h-5 text-slate-400" />
              <div className="flex-1">
                <p className="text-xs text-slate-500">Teléfono</p>
                <p className="text-white">+591 4 4123456</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="w-5 h-5 text-slate-400" />
              <div className="flex-1">
                <p className="text-xs text-slate-500">Ubicación</p>
                <p className="text-white">Cochabamba, Bolivia</p>
              </div>
            </div>
          </div>

          <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white">Editar Perfil</Button>
        </Card>

        {/* Notifications Section */}
        <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Notificaciones</h3>
          </div>

          <div className="space-y-4">
            {[
              { key: "alerts", label: "Alertas de Sensores", description: "Recibe notificaciones de alertas críticas" },
              { key: "email", label: "Correo Electrónico", description: "Resumen diario por correo" },
              { key: "push", label: "Notificaciones Push", description: "Alertas en tiempo real en tu dispositivo" },
              { key: "summary", label: "Resumen Semanal", description: "Reporte semanal de actividad" },
            ].map(({ key, label, description }) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600"
              >
                <div>
                  <p className="text-white font-medium">{label}</p>
                  <p className="text-xs text-slate-400">{description}</p>
                </div>
                <button
                  onClick={() => toggleNotification(key)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications[key as keyof typeof notifications] ? "bg-blue-600" : "bg-slate-600"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications[key as keyof typeof notifications] ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Preferences Section */}
        <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Eye className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Preferencias</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
              <label className="text-sm text-slate-400 mb-2 block">Tema</label>
              <select
                value={preferences.theme}
                onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                className="w-full bg-slate-600 text-white px-3 py-2 rounded-lg border border-slate-500 focus:outline-none focus:border-blue-500"
              >
                <option value="dark">Oscuro</option>
                <option value="light">Claro</option>
                <option value="auto">Automático</option>
              </select>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
              <label className="text-sm text-slate-400 mb-2 block">Idioma</label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className="w-full bg-slate-600 text-white px-3 py-2 rounded-lg border border-slate-500 focus:outline-none focus:border-blue-500"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
              <label className="text-sm text-slate-400 mb-2 block">Zona Horaria</label>
              <select
                value={preferences.timezone}
                onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                className="w-full bg-slate-600 text-white px-3 py-2 rounded-lg border border-slate-500 focus:outline-none focus:border-blue-500"
              >
                <option value="America/La_Paz">Bolivia (GMT-4)</option>
                <option value="America/New_York">New York (GMT-5)</option>
                <option value="Europe/London">London (GMT+0)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Security Section */}
        <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Seguridad</h3>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors">
              <div className="text-left">
                <p className="text-white font-medium">Cambiar Contraseña</p>
                <p className="text-xs text-slate-400">Última actualización: hace 3 meses</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors">
              <div className="text-left">
                <p className="text-white font-medium">Autenticación de Dos Factores</p>
                <p className="text-xs text-slate-400">Desactivado</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors">
              <div className="text-left">
                <p className="text-white font-medium">Sesiones Activas</p>
                <p className="text-xs text-slate-400">1 dispositivo conectado</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </Card>

        {/* Account Info Section */}
        <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Información de la Cuenta</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">ID de Usuario</span>
              <span className="text-white font-mono">USR-2024-001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Fecha de Registro</span>
              <span className="text-white">15 de Enero, 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Última Sesión</span>
              <span className="text-white">Hoy a las 14:32</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Versión de la App</span>
              <span className="text-white">v1.0.0</span>
            </div>
          </div>
        </Card>

        {/* Logout Button */}
        <Button className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2">
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </Button>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 md:hidden">
        <div className="flex items-center justify-around">
          {[
            { icon: "Activity", label: "Home" },
            { icon: "TrendingUp", label: "Tiempo Real" },
            { icon: "Wind", label: "Insights" },
            { icon: "Bell", label: "Alertas" },
            { icon: "Settings", label: "Cuenta" },
          ].map(({ label }) => (
            <button
              key={label}
              className={`flex-1 flex flex-col items-center justify-center py-3 ${
                label === "Cuenta" ? "text-blue-400" : "text-slate-400"
              } hover:text-white hover:bg-slate-700/50`}
            >
              <User className={`w-6 h-6 ${label === "Cuenta" ? "block" : "hidden"}`} />
              <span className="text-xs mt-1">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
