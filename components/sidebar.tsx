"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

const navItems = [
  { href: "/", icon: "dashboard", label: "Dashboard" },
  { href: "/clients", icon: "group", label: "Clientes" },
  { href: "/meetings", icon: "calendar_month", label: "Reuniones" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="bg-surface-container-low h-screen w-64 fixed left-0 top-0 flex flex-col py-6 z-50">
      {/* Logo */}
      <div className="px-6 mb-10">
        <Image src="/logo.png" alt="Posicionarte" width={160} height={48} className="object-contain" priority />
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold mt-2">CRM</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium tracking-tight transition-all ${
                isActive
                  ? "nav-active"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* CTA */}
      <div className="px-6 mb-6">
        <Link
          href="/clients/new"
          className="w-full cta-gradient text-white py-3 px-4 rounded-xl font-bold text-sm tracking-tight hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          Nuevo Cliente
        </Link>
      </div>

      {/* Bottom */}
      <div className="px-4 border-t border-white/5 pt-4 space-y-1">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white transition-colors font-medium tracking-tight hover:bg-neutral-800/50 rounded-lg"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
