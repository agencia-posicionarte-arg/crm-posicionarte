"use client"

import { useState, useTransition } from "react"
import { createClient, updateClient } from "@/lib/actions/clients"
import { Button } from "@/components/ui/button"
import { SERVICE_LABEL, BILLING_TYPE_LABEL, CLIENT_STATUS_LABEL } from "@/lib/constants"

type ClientData = {
  id?: string
  name?: string; company?: string; email?: string; phone?: string
  website?: string; industry?: string; status?: string
  monthlyAmount?: number; metaBudget?: number; googleBudget?: number
  billingType?: string; lastPaymentDate?: string; lastPaidMonth?: string
  contractStartDate?: string; lastContactDate?: string
  assignedToId?: string; notes?: string
  services?: { service: string }[]
}

type User = { id: string; name: string }

export default function ClientForm({ client, users }: { client?: ClientData; users: User[] }) {
  const isEdit = !!client?.id
  const [isPending, startTransition] = useTransition()
  const [selectedServices, setSelectedServices] = useState<string[]>(
    client?.services?.map((s) => s.service) ?? []
  )

  function toggleService(s: string) {
    setSelectedServices((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const data = {
      name: fd.get("name") as string,
      company: fd.get("company") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string || undefined,
      website: fd.get("website") as string || undefined,
      industry: fd.get("industry") as string || undefined,
      status: fd.get("status") as string,
      monthlyAmount: Number(fd.get("monthlyAmount")),
      metaBudget: fd.get("metaBudget") ? Number(fd.get("metaBudget")) : undefined,
      googleBudget: fd.get("googleBudget") ? Number(fd.get("googleBudget")) : undefined,
      billingType: fd.get("billingType") as string,
      lastPaymentDate: fd.get("lastPaymentDate") as string || undefined,
      lastPaidMonth: fd.get("lastPaidMonth") as string || undefined,
      contractStartDate: fd.get("contractStartDate") as string || undefined,
      lastContactDate: fd.get("lastContactDate") as string || undefined,
      assignedToId: fd.get("assignedToId") as string || undefined,
      notes: fd.get("notes") as string || undefined,
      services: selectedServices,
    }
    startTransition(async () => {
      if (isEdit) await updateClient(client!.id!, data)
      else await createClient(data)
    })
  }

  const inputClass = "w-full bg-surface-container border-b border-outline-variant/30 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-b-primary transition-colors rounded-t-lg"
  const labelClass = "block text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 mb-2"

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Identidad */}
      <section className="bg-surface-container-low rounded-2xl p-8">
        <h3 className="text-lg font-bold text-white tracking-tight mb-6">Datos de Contacto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "name", label: "Nombre", placeholder: "Nombre completo", required: true, defaultValue: client?.name },
            { name: "company", label: "Empresa", placeholder: "Nombre empresa", required: true, defaultValue: client?.company },
            { name: "email", label: "Email", placeholder: "email@empresa.com", type: "email", required: true, defaultValue: client?.email },
            { name: "phone", label: "Teléfono", placeholder: "+54 11 0000-0000", defaultValue: client?.phone },
            { name: "website", label: "Sitio Web", placeholder: "https://empresa.com", defaultValue: client?.website },
            { name: "industry", label: "Rubro", placeholder: "Ej: E-commerce, Salud...", defaultValue: client?.industry },
          ].map((f) => (
            <div key={f.name}>
              <label className={labelClass}>{f.label}</label>
              <input name={f.name} type={f.type ?? "text"} placeholder={f.placeholder} required={f.required} defaultValue={f.defaultValue ?? ""} className={inputClass} />
            </div>
          ))}
        </div>
      </section>

      {/* Comercial */}
      <section className="bg-surface-container-low rounded-2xl p-8">
        <h3 className="text-lg font-bold text-white tracking-tight mb-6">Info Comercial</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Estado</label>
            <select name="status" defaultValue={client?.status ?? "PROSPECTO"} className={inputClass}>
              {Object.entries(CLIENT_STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Inversión mensual ($)</label>
            <input name="monthlyAmount" type="number" min="0" step="0.01" required defaultValue={client?.monthlyAmount ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Presupuesto Meta ($)</label>
            <input name="metaBudget" type="number" min="0" step="0.01" defaultValue={client?.metaBudget ?? ""} placeholder="Opcional" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Presupuesto Google ($)</label>
            <input name="googleBudget" type="number" min="0" step="0.01" defaultValue={client?.googleBudget ?? ""} placeholder="Opcional" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Responsable</label>
            <select name="assignedToId" defaultValue={client?.assignedToId ?? ""} className={inputClass}>
              <option value="">Sin asignar</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-6">
          <label className={labelClass}>Servicios contratados</label>
          <div className="flex gap-3 flex-wrap mt-2">
            {Object.entries(SERVICE_LABEL).map(([k, v]) => (
              <button key={k} type="button" onClick={() => toggleService(k)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedServices.includes(k) ? "cta-gradient text-white" : "bg-surface-container-high text-neutral-400 hover:text-white"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Facturación */}
      <section className="bg-surface-container-low rounded-2xl p-8">
        <h3 className="text-lg font-bold text-white tracking-tight mb-6">Facturación</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Tipo de pago</label>
            <select name="billingType" defaultValue={client?.billingType ?? "PREPAID"} className={inputClass}>
              {Object.entries(BILLING_TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Último pago</label>
            <input name="lastPaymentDate" type="date" defaultValue={client?.lastPaymentDate?.slice(0, 10) ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Mes abonado (YYYY-MM)</label>
            <input name="lastPaidMonth" type="month" defaultValue={client?.lastPaidMonth ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Inicio de contrato</label>
            <input name="contractStartDate" type="date" defaultValue={client?.contractStartDate?.slice(0, 10) ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Último contacto</label>
            <input name="lastContactDate" type="date" defaultValue={client?.lastContactDate?.slice(0, 10) ?? ""} className={inputClass} />
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isPending}>
          <span className="material-symbols-outlined text-base">save</span>
          {isPending ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear cliente"}
        </Button>
      </div>
    </form>
  )
}
