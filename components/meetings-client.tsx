"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { MeetingStatusBadge } from "@/components/ui/badge"
import { updateMeeting, deleteMeeting } from "@/lib/actions/meetings"
import { ConfirmModal } from "@/components/ui/modal"
import { MEETING_STATUS_LABEL } from "@/lib/constants"

type Meeting = {
  id: string; title: string; scheduledAt: Date; status: string; notes: string | null
  client: { id: string; company: string }
  createdBy: { name: string }
}

function groupMeetings(meetings: Meeting[]) {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayEnd = new Date(todayStart.getTime() + 86400000)

  return {
    today: meetings.filter((m) => m.scheduledAt >= todayStart && m.scheduledAt < todayEnd),
    upcoming: meetings.filter((m) => m.scheduledAt >= todayEnd),
    past: meetings.filter((m) => m.scheduledAt < todayStart).reverse(),
  }
}

export default function MeetingsClient({ meetings }: { meetings: Meeting[] }) {
  const [filter, setFilter] = useState("ALL")
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = filter === "ALL" ? meetings : meetings.filter((m) => m.status === filter)
  const groups = groupMeetings(filtered)

  function handleStatusChange(id: string, status: string) {
    startTransition(async () => { await updateMeeting(id, { status }) })
  }

  function MeetingRow({ m }: { m: Meeting }) {
    return (
      <div className="bg-surface-container-low rounded-xl p-5 flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">
            {new Date(m.scheduledAt).toLocaleDateString("es-AR", { weekday: "long", day: "2-digit", month: "long" })} ·{" "}
            {new Date(m.scheduledAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
          </p>
          <h5 className="text-sm font-bold text-white">{m.title}</h5>
          <Link href={`/clients/${m.client.id}`} className="text-xs text-primary hover:underline mt-1 inline-block">
            {m.client.company}
          </Link>
          {m.notes && <p className="text-xs text-neutral-500 mt-2 line-clamp-2">{m.notes}</p>}
        </div>
        <div className="flex flex-col items-end gap-3">
          <MeetingStatusBadge status={m.status} />
          <select
            value={m.status}
            onChange={(e) => handleStatusChange(m.id, e.target.value)}
            className="bg-surface-container text-neutral-400 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-outline-variant/10 focus:outline-none"
          >
            {Object.entries(MEETING_STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <button onClick={() => setDeleteTarget(m.id)} className="text-neutral-600 hover:text-error transition-colors">
            <span className="material-symbols-outlined text-base">delete</span>
          </button>
        </div>
      </div>
    )
  }

  function Section({ title, items }: { title: string; items: Meeting[] }) {
    if (items.length === 0) return null
    return (
      <div className="mb-8">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-4">{title}</h3>
        <div className="space-y-3">{items.map((m) => <MeetingRow key={m.id} m={m} />)}</div>
      </div>
    )
  }

  return (
    <div>
      {/* Filter */}
      <div className="flex gap-2 mb-8">
        {["ALL", "PROGRAMADA", "REALIZADA", "CANCELADA"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === s ? "cta-gradient text-white" : "bg-surface-container-high text-neutral-400 hover:text-white"}`}
          >
            {s === "ALL" ? "Todas" : MEETING_STATUS_LABEL[s as keyof typeof MEETING_STATUS_LABEL]}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p className="text-sm text-neutral-500">Sin reuniones.</p>}
      <Section title="Hoy" items={groups.today} />
      <Section title="Próximas" items={groups.upcoming} />
      <Section title="Pasadas" items={groups.past} />

      <ConfirmModal
        open={!!deleteTarget}
        title="¿Eliminar reunión?"
        description="Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        danger
        onConfirm={() => { if (deleteTarget) { startTransition(async () => { await deleteMeeting(deleteTarget!); setDeleteTarget(null) }) } }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
