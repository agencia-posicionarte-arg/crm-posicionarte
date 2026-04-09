import Link from "next/link"
import { StatusBadge } from "@/components/ui/badge"

type RankingEntry = {
  id: string
  company: string
  status: string
  total: number
}

export default function ClientRanking({ data }: { data: RankingEntry[] }) {
  return (
    <div className="bg-surface-container-low rounded-2xl p-8">
      <h4 className="text-xl font-bold tracking-tight text-white mb-8">Ranking histórico por ingreso ARS</h4>
      <div className="space-y-4">
        {data.map((c, i) => (
          <div key={c.id} className="flex items-center gap-4">
            <span className="text-sm font-black text-neutral-600 w-5 text-right">{i + 1}</span>
            <div className="flex-1 flex items-center justify-between gap-3">
              <Link href={`/clients/${c.id}`} className="text-sm font-bold text-white hover:text-primary transition-colors truncate">
                {c.company}
              </Link>
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={c.status} />
                <span className="text-sm font-black text-secondary">${c.total.toLocaleString("es-AR")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
