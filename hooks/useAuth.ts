// app/hooks/useAuth.ts
"use client"

import { useState, useEffect } from "react"

const AUTH_STORAGE_KEY = "sensorhub_auth"

export interface UserData {
  email: string
  name: string
  role: string
  isAuthenticated: boolean
  loginTime: string
}

export function useAuth() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedData = localStorage.getItem(AUTH_STORAGE_KEY)
    if (storedData) {
      try {
        const userData: UserData = JSON.parse(storedData)
        setUser(userData)
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData: Omit<UserData, "isAuthenticated" | "loginTime">) => {
    const authData: UserData = {
      ...userData,
      isAuthenticated: true,
      loginTime: new Date().toISOString()
    }
    
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData))
    setUser(authData)
  }

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setUser(null)
  }

  const isAuthenticated = () => {
    if (!user) return false
    
    // Verificar expiración (24 horas)
    const loginTime = new Date(user.loginTime)
    const now = new Date()
    const hoursDiff = Math.abs(now.getTime() - loginTime.getTime()) / 36e5
    
    return hoursDiff <= 24
  }

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
  }
}