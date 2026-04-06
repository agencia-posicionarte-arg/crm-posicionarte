import { CLIENT_STATUS_LABEL } from "@/lib/constants"

interface PipelineChartProps {
  data: { status: string; count: number }[]
}

const BAR_COLORS: Record<string, string> = {
  PROSPECTO: "#b8c4ff",
  ACTIVO: "#3256d7",
  PAUSADO: "#444654",
  PERDIDO: "#ffb4ab",
}

export default function PipelineChart({ data }: PipelineChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className="bg-surface-container-low p-8 rounded-2xl lg:col-span-2">
      <h4 className="text-xl font-bold tracking-tight text-white mb-10">Pipeline de Clientes</h4>
      <div className="flex items-end justify-around h-48 gap-4 px-4">
        {data.map((d) => {
          const heightPct = Math.round((d.count / max) * 100)
          return (
            <div key={d.status} className="flex-1 flex flex-col items-center gap-3">
              <span className="text-xs font-bold text-neutral-400">{d.count}</span>
              <div className="w-full bg-neutral-800 rounded-t-lg relative" style={{ height: "10rem" }}>
                <div
                  className="absolute bottom-0 left-0 w-full rounded-t-lg transition-all"
                  style={{ height: `${heightPct}%`, backgroundColor: BAR_COLORS[d.status] ?? "#444" }}
                />
              </div>
              <span className="text-xs font-bold text-neutral-400 tracking-tight">
                {CLIENT_STATUS_LABEL[d.status as keyof typeof CLIENT_STATUS_LABEL] ?? d.status}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
