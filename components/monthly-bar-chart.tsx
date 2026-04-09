"use client"

type MonthData = { month: string; total: number }

function formatMonth(month: string) {
  const [year, m] = month.split('-')
  const labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return `${labels[parseInt(m) - 1]} '${year.slice(2)}`
}

function formatARS(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${n}`
}

export default function MonthlyBarChart({ data }: { data: MonthData[] }) {
  if (data.length === 0) return null

  const max = Math.max(...data.map(d => d.total))
  const BAR_W = 38
  const GAP = 14
  const H = 160
  const totalW = data.length * (BAR_W + GAP)

  return (
    <div className="bg-surface-container-low rounded-2xl p-8">
      <h4 className="text-xl font-bold tracking-tight text-white mb-8">Ingreso mensual histórico</h4>
      <div className="overflow-x-auto pb-2">
        <svg width={totalW} height={H + 52} className="overflow-visible" style={{ minWidth: totalW }}>
          {data.map((d, i) => {
            const barH = max > 0 ? Math.max((d.total / max) * H, 4) : 4
            const x = i * (BAR_W + GAP)
            const y = H - barH
            return (
              <g key={d.month}>
                <rect x={x} y={y} width={BAR_W} height={barH} rx={5} fill="#3256d7" opacity={0.8} />
                <text x={x + BAR_W / 2} y={y - 6} textAnchor="middle" fill="#b8c4ff" fontSize={8.5} fontWeight="800">
                  {formatARS(d.total)}
                </text>
                <text x={x + BAR_W / 2} y={H + 18} textAnchor="middle" fill="#555" fontSize={8.5}>
                  {formatMonth(d.month)}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
