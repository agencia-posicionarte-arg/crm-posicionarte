"use client"

import { useState, useTransition } from "react"
import { updateClientNotes } from "@/lib/actions/clients"
import { Button } from "@/components/ui/button"

export default function NotesForm({ clientId, initialNotes }: { clientId: string; initialNotes: string }) {
  const [notes, setNotes] = useState(initialNotes)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function handleSave() {
    startTransition(async () => {
      await updateClientNotes(clientId, notes)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <div className="bg-surface-container-low rounded-2xl p-8">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={10}
        placeholder="Escribí notas, comentarios, contexto del cliente..."
        className="w-full bg-surface-container text-sm text-white placeholder:text-neutral-600 rounded-xl p-4 focus:outline-none focus:ring-1 focus:ring-primary-container/30 resize-none"
      />
      <div className="flex justify-end mt-4 gap-3 items-center">
        {saved && <span className="text-xs text-secondary">✓ Guardado</span>}
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar notas"}
        </Button>
      </div>
    </div>
  )
}
