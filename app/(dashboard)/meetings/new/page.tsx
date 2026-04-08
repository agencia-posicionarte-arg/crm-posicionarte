export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/db"
import MeetingForm from "@/components/meeting-form"
import Link from "next/link"

export default async function NewMeetingPage({ searchParams }: { searchParams: Promise<{ clientId?: string }> }) {
  const { clientId } = await searchParams
  const clients = await prisma.client.findMany({ select: { id: true, company: true }, orderBy: { company: "asc" } })

  return (
    <div>
      <div className="mb-10">
        <Link href="/meetings" className="text-sm text-neutral-500 hover:text-white flex items-center gap-1 mb-4">
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Volver a reuniones
        </Link>
        <h2 className="text-4xl font-extrabold tracking-tighter text-white">Nueva Reunión</h2>
      </div>
      <MeetingForm clients={clients} defaultClientId={clientId} />
    </div>
  )
}
