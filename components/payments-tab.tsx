"use client"

import { useState, useTransition } from "react"
import { createPayment, deletePayment } from "@/lib/actions/payments"
import { Button } from "@/components/ui/button"

type Payment = {
  id: string
  amountARS: number
  date: Date
  month: string
  description: string | null
}

function currentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

export default function PaymentsTab({ clientId, payments }: { clientId: string; payments: Payment[] }) {
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setError(null)
    startTransition(async () => {
      const result = await createPayment({
        clientId,
        amountARS: Number(fd.get("amountARS")),
        date: fd.get("date") as string,
        month: fd.get("month") as string,
        description: fd.get("description") as string || undefined,
      })
      if (result?.error) setError(result.error)
      else setShowForm(false)
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => { await deletePayment(id, clientId) })
  }

  const inputClass = "w-full bg-surface-container border-b border-outline-variant/30 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-b-primary transition-colors rounded-t-lg"
  const labelClass = "block text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 mb-2"

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Historial de pagos</h3>
        {!showForm && (
          <Button type="button" onClick={() => setShowForm(true)}>
            <span className="material-symbols-outlined text-base">add</span>
            Agregar pago
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-surface-container-low rounded-2xl p-6 mb-6 space-y-4">
          <h4 className="text-sm font-bold text-white mb-4">Nuevo pago</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Monto (ARS)</label>
              <input name="amountARS" type="number" min="0" step="0.01" required placeholder="Ej: 150000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Fecha de pago</label>
              <input name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Mes que cubre (YYYY-MM)</label>
              <input name="month" type="month" required defaultValue={currentMonth()} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Descripción (opcional)</label>
              <input name="description" type="text" placeholder="Ej: Abono abril, Sitio web..." className={inputClass} />
            </div>
          </div>
          {error && (
            <div className="bg-error/10 border border-error/30 text-error text-sm rounded-xl px-4 py-2">
              Error: {error}
            </div>
          )}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors">
              Cancelar
            </button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Registrar pago"}
            </Button>
          </div>
        </form>
      )}

      {payments.length === 0 && !showForm && (
        <p className="text-sm text-neutral-500">Sin pagos registrados.</p>
      )}

      <div className="space-y-3">
        {payments.map((p) => (
          <div key={p.id} className="bg-surface-container-low rounded-xl px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mb-1">
                {p.month} · {new Date(p.date).toLocaleDateString("es-AR")}
              </p>
              <p className="text-white font-bold">
                ${p.amountARS.toLocaleString("es-AR")} ARS
              </p>
              {p.description && <p className="text-xs text-neutral-400 mt-0.5">{p.description}</p>}
            </div>
            <button
              onClick={() => handleDelete(p.id)}
              disabled={isPending}
              className="text-neutral-600 hover:text-error transition-colors"
            >
              <span className="material-symbols-outlined text-base">delete</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
