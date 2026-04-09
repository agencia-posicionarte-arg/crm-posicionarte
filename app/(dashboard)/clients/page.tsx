export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/db"
import ClientTable from "@/components/client-table"
import Link from "next/link"

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { monthlyAmount: "desc" },
    include: { services: true },
  })

  return (
    <div>
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tighter text-white mb-2">Clientes</h2>
          <p className="text-neutral-500 font-medium tracking-tight">{clients.length} clientes registrados.</p>
        </div>
        <Link
          href="/clients/new"
          className="cta-gradient text-white py-2.5 px-5 rounded-xl font-bold text-sm tracking-tight hover:opacity-90 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          Nuevo Cliente
        </Link>
      </div>
      <ClientTable clients={clients} />
    </div>
  )
}
