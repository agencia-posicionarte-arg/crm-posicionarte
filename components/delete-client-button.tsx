"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ConfirmModal } from "@/components/ui/modal"
import { deleteClient } from "@/lib/actions/clients"

export default function DeleteClientButton({ clientId }: { clientId: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="danger" size="sm" onClick={() => setOpen(true)}>
        <span className="material-symbols-outlined text-base">delete</span>
        Eliminar
      </Button>
      <ConfirmModal
        open={open}
        title="¿Eliminar cliente?"
        description="Esta acción es irreversible. Se eliminarán también todas sus reuniones."
        confirmLabel="Sí, eliminar"
        danger
        onConfirm={() => deleteClient(clientId)}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
