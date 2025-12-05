"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, TrendingUp, Wind, Bell, Settings } from "lucide-react"

const navItems = [
  { href: "/home", icon: Activity, label: "Home" },
  { href: "/realtime", icon: TrendingUp, label: "Tiempo Real" },
  { href: "/insights", icon: Wind, label: "Insights" },
  { href: "/alerts", icon: Bell, label: "Alertas" },
  { href: "/profile", icon: Settings, label: "Cuenta" },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <>
      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 md:hidden z-50">
        <div className="flex items-center justify-around">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors ${
                  isActive ? "text-blue-400 bg-slate-700/50" : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Padding for mobile nav */}
      <div className="h-20 md:h-0" />
    </>
  )
}
