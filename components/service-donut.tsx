import { SERVICE_LABEL } from "@/lib/constants"

interface ServiceDonutProps {
  data: { service: string; count: number }[]
  activeCount: number
}

const COLORS = ["#3256d7", "#41e575", "#b8c4ff", "#c8c6c6"]
const R = 80
const CIRC = 2 * Math.PI * R

export default function ServiceDonut({ data, activeCount }: ServiceDonutProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0) || 1
  let cumulative = 0

  return (
    <div className="bg-surface-container-low p-8 rounded-2xl flex flex-col">
      <h4 className="text-xl font-bold tracking-tight text-white mb-8">Servicios</h4>
      <div className="flex-1 flex items-center justify-center relative">
        <svg className="w-44 h-44 -rotate-90" viewBox="0 0 192 192">
          <circle cx="96" cy="96" r={R} fill="none" stroke="#353534" strokeWidth="18" />
          {data.map((d, i) => {
            const pct = d.count / total
            const dashArray = `${pct * CIRC} ${CIRC}`
            const dashOffset = -cumulative * CIRC
            cumulative += pct
            return (
              <circle
                key={d.service}
                cx="96" cy="96" r={R}
                fill="none"
                stroke={COLORS[i % COLORS.length]}
                strokeWidth="20"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
              />
            )
          })}
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-black text-white">{activeCount}</span>
          <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">activos</span>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {data.map((d, i) => (
          <div key={d.service} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-xs font-bold text-neutral-300">
                {SERVICE_LABEL[d.service as keyof typeof SERVICE_LABEL] ?? d.service}
              </span>
            </div>
            <span className="text-xs font-black text-white">{Math.round((d.count / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
