"use client"

import { useState } from "react"
import Link from "next/link"
import { StatusBadge, ServiceBadge } from "@/components/ui/badge"

type Client = {
  id: string
  name: string
  company: string
  email: string
  status: string
  monthlyAmount: number
  lastContactDate: Date | null
  services: { service: string }[]
}

export default function ClientTable({ clients }: { clients: Client[] }) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  const filtered = clients.filter((c) => {
    const matchSearch = search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "ALL" || c.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-lg">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, empresa, email..."
            className="w-full bg-surface-container pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary-container/30"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-surface-container text-white text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-container/30 border border-outline-variant/10"
        >
          <option value="ALL">Todos los estados</option>
          {["PROSPECTO", "ACTIVO", "PAUSADO", "PERDIDO"].map((s) => (
            <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface-container-low rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5">
              {["Cliente", "Email", "Estado", "Servicios", "Inversión /mo", "Último contacto"].map((h) => (
                <th key={h} className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-neutral-500">Sin resultados.</td></tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id} className="group hover:bg-surface-container/50 transition-colors">
                <td className="px-6 py-4">
                  <Link href={`/clients/${c.id}`} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center font-black text-primary text-xs">
                      {c.company.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{c.company}</p>
                      <p className="text-[10px] text-neutral-500">{c.name}</p>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-400">{c.email}</td>
                <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                <td className="px-6 py-4">
                  <div className="flex gap-1 flex-wrap">
                    {c.services.map((s) => <ServiceBadge key={s.service} service={s.service} />)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-white">${c.monthlyAmount.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-400">
                  {c.lastContactDate
                    ? new Date(c.lastContactDate).toLocaleDateString("es-AR")
                    : <span className="text-neutral-600">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
