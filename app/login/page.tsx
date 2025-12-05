"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AlertCircle, Mail, Lock } from "lucide-react"

// Definir los usuarios estáticos
const STATIC_USERS = [
  {
    email: "admin@sensorhub.com",
    password: "admin123",
    name: "Administrador",
    role: "admin"
  },
  {
    email: "usuario@sensorhub.com",
    password: "usuario123",
    name: "Usuario Regular",
    role: "user"
  }
]

// Clave para localStorage
const AUTH_STORAGE_KEY = "sensorhub_auth"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"email" | "password">("email")

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError("Por favor ingresa tu email")
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Por favor ingresa un email válido")
      return
    }
    
    setError("")
    setStep("password")
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password) {
      setError("Por favor ingresa tu contraseña")
      return
    }

    setIsLoading(true)
    
    setTimeout(() => {
      setIsLoading(false)
      
      const user = STATIC_USERS.find(
        user => user.email.toLowerCase() === email.toLowerCase() && user.password === password
      )
      
      if (user) {
        // Guardar datos en localStorage
        const authData = {
          email: user.email,
          name: user.name,
          role: user.role,
          isAuthenticated: true,
          loginTime: new Date().toISOString()
        }
        
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData))
        
        // Redirigir a home
        router.push("/home")
        
      } else {
        setError("Credenciales incorrectas")
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-600 mb-4">
            <div className="w-6 h-6 bg-white rounded-sm"></div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">SensorHub</h1>
          <p className="text-slate-400">Monitoreo en tiempo real</p>
        </div>

        {/* Login Card */}
        <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
          <form onSubmit={step === "email" ? handleEmailSubmit : handlePasswordSubmit}>
            {step === "email" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Correo electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <Input
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError("")
                      }}
                      className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                      autoFocus
                    />
                  </div>
                </div>
                
                <div className="text-xs text-slate-400 p-3 bg-slate-700/50 rounded-lg">
                  <p className="font-medium mb-1">Usuarios de prueba:</p>
                  <ul className="space-y-1">
                    {STATIC_USERS.map((user, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-blue-400">•</span>
                        <span>{user.email}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Continuar
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4 p-3 bg-slate-700 rounded-lg">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-slate-300">{email}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email")
                      setError("")
                    }}
                    className="ml-auto text-xs text-blue-400 hover:text-blue-300"
                  >
                    Cambiar
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setError("")
                      }}
                      className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                      autoFocus
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-400">{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
                >
                  {isLoading ? "Ingresando..." : "Ingresar"}
                </Button>
              </div>
            )}
          </form>
        </Card>

        {/* Footer Links */}
        <div className="text-center space-y-2">
          <button 
            className="text-sm text-blue-400 hover:text-blue-300"
            onClick={() => {
              alert(`Usuarios de prueba:\n\n1. ${STATIC_USERS[0].email} / ${STATIC_USERS[0].password}\n2. ${STATIC_USERS[1].email} / ${STATIC_USERS[1].password}`)
            }}
          >
            ¿Olvidaste tu contraseña?
          </button>
          <p className="text-sm text-slate-400">
            ¿No tienes cuenta? <button className="text-blue-400 hover:text-blue-300">Regístrate</button>
          </p>
        </div>
      </div>
    </div>
  )
}