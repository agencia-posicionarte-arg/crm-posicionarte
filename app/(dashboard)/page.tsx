export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/db"
import StatCard from "@/components/stat-card"
import PipelineChart from "@/components/pipeline-chart"
import ServiceDonut from "@/components/service-donut"
import PaymentStatusBadge from "@/components/payment-status-badge"
import { StatusBadge } from "@/components/ui/badge"
import Link from "next/link"

function currentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

export default async function DashboardPage() {
  const month = currentMonth()

  const [clients, meetings, serviceRows, paymentsThisMonth] = await Promise.all([
    prisma.client.findMany({ include: { services: true, payments: { select: { month: true } } } }),
    prisma.meeting.findMany({
      where: { status: "PROGRAMADA", scheduledAt: { gte: new Date() } },
      orderBy: { scheduledAt: "asc" },
      take: 3,
      include: { client: true },
    }),
    prisma.clientService.groupBy({ by: ["service"], _count: { service: true } }),
    prisma.payment.findMany({
      where: { month },
      select: { amountARS: true },
    }),
  ])

  const active = clients.filter((c) => c.status === "ACTIVO")
  const mrr = active
    .filter((c) => c.billingType === "MONTHLY")
    .reduce((sum, c) => sum + c.monthlyAmount, 0)
  const cobradoEsteMes = paymentsThisMonth.reduce((sum, p) => sum + p.amountARS, 0)
  const convRate = clients.length > 0 ? Math.round((active.length / clients.length) * 100) : 0

  const pipelineData = ["PROSPECTO", "ACTIVO", "PAUSADO", "PERDIDO"].map((status) => ({
    status,
    count: clients.filter((c) => c.status === status).length,
  }))

  const serviceData = serviceRows.map((r) => ({ service: r.service, count: r._count.service }))

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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard label="Clientes Activos" value={String(active.length)} icon="groups" delta={`${clients.length} total`} />
        <StatCard label="Abonos proyectados" value={`USD ${mrr.toLocaleString()}`} icon="payments" delta="mensual · clientes activos" />
        <StatCard label="Cobrado este mes" value={`$${cobradoEsteMes.toLocaleString("es-AR")} ARS`} icon="account_balance_wallet" delta={month} deltaPositive={cobradoEsteMes > 0} />
        <StatCard label="Tasa de Conversión" value={`${convRate}%`} icon="query_stats" deltaPositive={convRate > 50} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <PipelineChart data={pipelineData} />
        <ServiceDonut data={serviceData} />
      </div>

      {/* Bottom: Meetings + Recent Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Upcoming Meetings */}
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

        {/* Recent Clients */}
        <div className="lg:col-span-3 bg-surface-container-low p-8 rounded-2xl">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-xl font-bold tracking-tight text-white">Movimiento Reciente</h4>
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
                    <PaymentStatusBadge
                      billingType={c.billingType}
                      paymentTiming={c.paymentTiming}
                      status={c.status}
                      payments={c.payments}
                    />
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
    </div>
  )
}
