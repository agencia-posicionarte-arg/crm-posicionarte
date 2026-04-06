"use client"

import { useTransition } from "react"
import { createMeeting } from "@/lib/actions/meetings"
import { Button } from "@/components/ui/button"

type Client = { id: string; company: string }

export default function MeetingForm({ clients, defaultClientId }: { clients: Client[]; defaultClientId?: string }) {
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(() =>
      createMeeting({
        title: fd.get("title") as string,
        scheduledAt: fd.get("scheduledAt") as string,
        clientId: fd.get("clientId") as string,
        notes: fd.get("notes") as string || undefined,
      })
    )
  }

  const inputClass = "w-full bg-surface-container border-b border-outline-variant/30 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-b-primary transition-colors rounded-t-lg"
  const labelClass = "block text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 mb-2"

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-surface-container-low rounded-2xl p-8 space-y-6">
        <div>
          <label className={labelClass}>Título</label>
          <input name="title" required placeholder="Ej: SEO Audit Review" className={inputClass} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Fecha y hora</label>
            <input name="scheduledAt" type="datetime-local" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Cliente</label>
            <select name="clientId" required defaultValue={defaultClientId ?? ""} className={inputClass}>
              <option value="" disabled>Seleccionar cliente...</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.company}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Notas (opcional)</label>
          <textarea name="notes" rows={4} placeholder="Agenda, objetivos, contexto..." className="w-full bg-surface-container rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary-container/30 resize-none" />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Guardando..." : "Crear reunión"}
          </Button>
        </div>
      </div>
    </form>
  )
}
