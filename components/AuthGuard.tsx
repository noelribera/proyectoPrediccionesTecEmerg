// app/components/AuthGuard.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

const AUTH_STORAGE_KEY = "sensorhub_auth"

interface UserData {
  email: string
  name: string
  role: string
  isAuthenticated: boolean
  loginTime: string
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    try {
      const authData = localStorage.getItem(AUTH_STORAGE_KEY)
      
      if (!authData) {
        router.push("/login")
        return
      }

      const userData: UserData = JSON.parse(authData)
      
      // Validar que los datos necesarios existan
      if (!userData.isAuthenticated || !userData.email || !userData.name) {
        localStorage.removeItem(AUTH_STORAGE_KEY)
        router.push("/login")
        return
      }

      // Verificar si la sesión es reciente (opcional: expiración de 24 horas)
      const loginTime = new Date(userData.loginTime)
      const now = new Date()
      const hoursDiff = Math.abs(now.getTime() - loginTime.getTime()) / 36e5
      
      if (hoursDiff > 24) {
        // Sesión expirada
        localStorage.removeItem(AUTH_STORAGE_KEY)
        router.push("/login")
        return
      }

      setIsAuthenticated(true)
    } catch (error) {
      console.error("Error validando autenticación:", error)
      localStorage.removeItem(AUTH_STORAGE_KEY)
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-white">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : null
}