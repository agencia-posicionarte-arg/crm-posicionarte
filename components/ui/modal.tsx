"use client"

import { useEffect } from "react"
import { Button } from "./button"

interface ModalProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

export function ConfirmModal({ open, title, description, confirmLabel = "Confirmar", cancelLabel = "Cancelar", onConfirm, onCancel, danger }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-surface-container-low rounded-2xl p-8 w-full max-w-sm shadow-2xl shadow-black/40">
        <h3 className="text-lg font-bold text-white tracking-tight mb-2">{title}</h3>
        {description && <p className="text-sm text-neutral-400 mb-6">{description}</p>}
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" size="sm" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={danger ? "danger" : "primary"} size="sm" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  )
}
