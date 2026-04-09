export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/db"
import StatCard from "@/components/stat-card"
import PipelineChart from "@/components/pipeline-chart"
import ServiceDonut from "@/components/service-donut"
import MonthlyBarChart from "@/components/monthly-bar-chart"
import ClientRanking from "@/components/client-ranking"
import PaymentStatusBadge from "@/components/payment-status-badge"
import { StatusBadge } from "@/components/ui/badge"
import Link from "next/link"

function currentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

function previousMonth() {
  const now = new Date()
  const d = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

function formatMonthLabel(month: string) {
  const [year, m] = month.split('-')
  const labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return `${labels[parseInt(m) - 1]} ${year}`
}

export default async function DashboardPage() {
  const month = currentMonth()
  const prevMonth = previousMonth()

  const [clients, meetings, serviceRows, paymentsThisMonth, monthlyHistory, prevMonthPayments, clientTotals] = await Promise.all([
    prisma.client.findMany({ include: { services: true, payments: { select: { month: true } } } }),
    prisma.meeting.findMany({
      where: { status: "PROGRAMADA", scheduledAt: { gte: new Date() } },
      orderBy: { scheduledAt: "asc" },
      take: 3,
      include: { client: true },
    }),
    prisma.clientService.groupBy({ by: ["service"], where: { client: { status: "ACTIVO" } }, _count: { service: true } }),
    prisma.payment.findMany({ where: { month }, select: { amountARS: true } }),
    prisma.payment.groupBy({ by: ["month"], _sum: { amountARS: true }, orderBy: { month: "asc" } }),
    prisma.payment.findMany({ where: { month: prevMonth }, select: { amountARS: true } }),
    prisma.payment.groupBy({
      by: ["clientId"],
      _sum: { amountARS: true },
      orderBy: { _sum: { amountARS: "desc" } },
      take: 10,
    }),
  ])

  // KPIs existentes
  const active = clients.filter((c) => c.status === "ACTIVO")
  const mrr = active.filter((c) => c.billingType === "MONTHLY").reduce((sum, c) => sum + c.monthlyAmount, 0)
  const cobradoEsteMes = paymentsThisMonth.reduce((sum, p) => sum + p.amountARS, 0)
  const convRate = clients.length > 0 ? Math.round((active.length / clients.length) * 100) : 0

  // KPIs históricos
  const totalHistorico = monthlyHistory.reduce((sum, p) => sum + (p._sum.amountARS ?? 0), 0)
  const prevMonthTotal = prevMonthPayments.reduce((sum, p) => sum + p.amountARS, 0)
  const promedioMensual = monthlyHistory.length > 0 ? Math.round(totalHistorico / monthlyHistory.length) : 0
  const mejorMes = monthlyHistory.length > 0
    ? monthlyHistory.reduce((best, p) => (p._sum.amountARS ?? 0) > (best._sum.amountARS ?? 0) ? p : best, monthlyHistory[0])
    : null
  const crecimiento = prevMonthTotal > 0
    ? Math.round(((cobradoEsteMes - prevMonthTotal) / prevMonthTotal) * 100)
    : null
  const clientesConDeuda = active.filter((c) =>
    (c.billingType === "MONTHLY" || c.billingType === "COMMISSION") &&
    !c.payments.some((p) => p.month === (c.paymentTiming === "ARREAR" ? prevMonth : month))
  ).length

  // Ranking de clientes
  const clientIds = clientTotals.map((t) => t.clientId)
  const rankingClientData = await prisma.client.findMany({
    where: { id: { in: clientIds } },
    select: { id: true, company: true, status: true },
  })
  const ranking = clientTotals
    .map((t) => ({ ...rankingClientData.find((c) => c.id === t.clientId)!, total: t._sum.amountARS ?? 0 }))
    .filter((r) => r.company)

  const pipelineData = ["PROSPECTO", "ACTIVO", "PAUSADO", "PERDIDO"].map((status) => ({
    status,
    count: clients.filter((c) => c.status === status).length,
  }))
  const serviceData = serviceRows.map((r) => ({ service: r.service, count: r._count.service }))
  const barData = monthlyHistory.map((p) => ({ month: p.month, total: p._sum.amountARS ?? 0 }))

  const recentClients = await prisma.client.findMany({
    orderBy: { monthlyAmount: "desc" },
    take: 5,
    include: { services: true, payments: { select: { month: true } } },
  })

  return (
    <div>
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tighter text-white mb-2">Dashboard</h2>
          <p className="text-neutral-500 font-medium tracking-tight">Resumen operativo en tiempo real.</p>
        </div>
      </div>

      {/* KPI Cards — actuales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard label="Clientes Activos" value={String(active.length)} icon="groups" delta={`${clients.length} total`} />
        <StatCard label="Abonos proyectados" value={`USD ${mrr.toLocaleString()}`} icon="payments" delta="mensual · clientes activos" />
        <StatCard label="Cobrado este mes" value={`$${cobradoEsteMes.toLocaleString("es-AR")} ARS`} icon="account_balance_wallet" delta={month} deltaPositive={cobradoEsteMes > 0} />
        <StatCard label="Tasa de Conversión" value={`${convRate}%`} icon="query_stats" deltaPositive={convRate > 50} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <PipelineChart data={pipelineData} />
        <ServiceDonut data={serviceData} activeCount={active.length} />
      </div>

      {/* Bottom: Meetings + Recent Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        <div className="bg-surface-container-low p-8 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold tracking-tight text-white">Próximas Reuniones</h4>
            <Link href="/meetings" className="text-[10px] font-bold text-primary-container px-2 py-0.5 bg-primary-container/10 rounded">Ver todas</Link>
          </div>
          <div className="space-y-6">
            {meetings.length === 0 && <p className="text-sm text-neutral-500">Sin reuniones programadas.</p>}
            {meetings.map((m) => (
              <div key={m.id} className="group cursor-pointer">
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">
                  {new Date(m.scheduledAt).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })} ·{" "}
                  {new Date(m.scheduledAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                </p>
                <h5 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{m.title}</h5>
                <p className="text-[10px] text-neutral-500 mt-1">{m.client.company}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 bg-surface-container-low p-8 rounded-2xl">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-xl font-bold tracking-tight text-white">Principales Clientes</h4>
            <Link href="/clients" className="text-xs font-bold text-primary hover:underline">Ver todos</Link>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                {["Cliente", "Estado", "Pago", "Servicios"].map((h) => (
                  <th key={h} className="pb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentClients.map((c) => (
                <tr key={c.id} className="group">
                  <td className="py-4">
                    <Link href={`/clients/${c.id}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center font-black text-primary text-xs">
                        {c.company.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{c.company}</p>
                        <p className="text-[10px] text-neutral-500">{c.email}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="py-4"><StatusBadge status={c.status} /></td>
                  <td className="py-4">
                    <PaymentStatusBadge billingType={c.billingType} paymentTiming={c.paymentTiming} status={c.status} payments={c.payments} />
                  </td>
                  <td className="py-4">
                    <div className="flex gap-1 flex-wrap">
                      {c.services.map((s) => (
                        <span key={s.id} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">{s.service.replace("_", " ")}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráfico histórico + Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <MonthlyBarChart data={barData} />
        </div>
        <ClientRanking data={ranking} />
      </div>

      {/* KPI Cards — históricos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          label="Ingreso acumulado"
          value={`$${(totalHistorico / 1_000_000).toFixed(2)}M ARS`}
          icon="savings"
          delta="histórico total"
        />
        <StatCard
          label="Crecimiento vs mes ant."
          value={crecimiento !== null ? `${crecimiento > 0 ? "+" : ""}${crecimiento}%` : "—"}
          icon="trending_up"
          deltaPositive={crecimiento !== null && crecimiento >= 0}
          delta={`vs ${formatMonthLabel(prevMonth)}`}
        />
        <StatCard
          label="Promedio mensual"
          value={`$${promedioMensual.toLocaleString("es-AR")} ARS`}
          icon="equalizer"
          delta={`${monthlyHistory.length} meses`}
        />
        <StatCard
          label="Mejor mes histórico"
          value={mejorMes ? formatMonthLabel(mejorMes.month) : "—"}
          icon="emoji_events"
          delta={mejorMes ? `$${((mejorMes._sum.amountARS ?? 0) / 1_000_000).toFixed(2)}M ARS` : ""}
          deltaPositive
        />
        <StatCard
          label="Activos con deuda"
          value={String(clientesConDeuda)}
          icon="warning"
          delta={`de ${active.length} activos`}
          deltaPositive={clientesConDeuda === 0}
        />
      </div>
    </div>
  )
}
