"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function Header() {
  const pathname = usePathname()

  const navItems = [
    { href: "/home", label: "Dashboard" },
    { href: "/realtime", label: "Tiempo Real" },
    { href: "/insights", label: "Insights" },
    { href: "/predictions", label: "Predicciones" },
  ]


  function logout(){
    const router = useRouter()
    localStorage.removeItem("sensorhub_auth")
    router.push("/login")
  }

  return (
    <header className="hidden md:block bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-white">GAMC Sensores</h1>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/profile">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
            <Settings className="w-5 h-5" />
          </Button>
          </Link>           
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <LogOut className="w-5 h-5" />
            </Button>           
        </div>
      </div>
    </header>
  )
}
