import { prisma } from "@/lib/db"
import ClientForm from "@/components/client-form"
import Link from "next/link"

export default async function NewClientPage() {
  const users = await prisma.user.findMany({ select: { id: true, name: true } })

  return (
    <div>
      <div className="mb-10">
        <Link href="/clients" className="text-sm text-neutral-500 hover:text-white flex items-center gap-1 mb-4">
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Volver a clientes
        </Link>
        <h2 className="text-4xl font-extrabold tracking-tighter text-white">Nuevo Cliente</h2>
      </div>
      <ClientForm users={users} />
    </div>
  )
}
