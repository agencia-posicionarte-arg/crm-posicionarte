interface StatCardProps {
  label: string
  value: string
  delta?: string
  deltaPositive?: boolean
  icon: string
}

export default function StatCard({ label, value, delta, deltaPositive = true, icon }: StatCardProps) {
  return (
    <div className="bg-surface-container-low p-8 rounded-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <span className="material-symbols-outlined text-6xl text-primary">{icon}</span>
      </div>
      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-neutral-500 mb-4">{label}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-4xl font-extrabold text-white tracking-tighter">{value}</h3>
        {delta && (
          <span className={`text-sm font-bold flex items-center gap-1 ${deltaPositive ? "text-secondary" : "text-error"}`}>
            <span className="material-symbols-outlined text-xs">{deltaPositive ? "trending_up" : "trending_down"}</span>
            {delta}
          </span>
        )}
      </div>
    </div>
  )
}
