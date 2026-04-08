export const dynamic = 'force-dynamic'

import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/db"
import ClientTabs from "@/components/client-tabs"
import ClientForm from "@/components/client-form"
import PaymentsTab from "@/components/payments-tab"
import PaymentStatusBadge from "@/components/payment-status-badge"
import { StatusBadge, MeetingStatusBadge } from "@/components/ui/badge"
import DeleteClientButton from "@/components/delete-client-button"
import NotesForm from "@/components/notes-form"
import { BILLING_TYPE_LABEL, type BillingType } from "@/lib/constants"

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [client, users] = await Promise.all([
    prisma.client.findUnique({
      where: { id },
      include: {
        services: true,
        meetings: { orderBy: { scheduledAt: "desc" } },
        assignedTo: true,
        payments: { orderBy: { date: "desc" } },
      },
    }),
    prisma.user.findMany({ select: { id: true, name: true } }),
  ])

  if (!client) notFound()

  const tabs = [
    { id: "info", label: "Info General" },
    { id: "billing", label: "Facturación" },
    { id: "payments", label: `Pagos (${client.payments.length})` },
    { id: "meetings", label: `Reuniones (${client.meetings.length})` },
    { id: "notes", label: "Notas" },
  ]

  const clientForForm = {
    id: client.id,
    name: client.name,
    company: client.company,
    email: client.email,
    phone: client.phone ?? undefined,
    website: client.website ?? undefined,
    industry: client.industry ?? undefined,
    status: client.status,
    billingType: client.billingType,
    monthlyAmount: client.monthlyAmount,
    commissionRate: client.commissionRate ?? undefined,
    metaBudget: client.metaBudget ?? undefined,
    googleBudget: client.googleBudget ?? undefined,
    contractStartDate: client.contractStartDate?.toISOString() ?? undefined,
    lastContactDate: client.lastContactDate?.toISOString() ?? undefined,
    assignedToId: client.assignedToId ?? undefined,
    notes: client.notes ?? undefined,
    services: client.services,
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <Link href="/clients" className="text-sm text-neutral-500 hover:text-white flex items-center gap-1 mb-4">
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Volver a clientes
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center font-black text-primary text-xl">
              {client.company.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tighter text-white">{client.company}</h2>
              <p className="text-neutral-500 mt-1">{client.name} · {client.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <StatusBadge status={client.status} />
                <PaymentStatusBadge
                  billingType={client.billingType}
                  payments={client.payments.map(p => ({ month: p.month }))}
                />
              </div>
            </div>
          </div>
          <DeleteClientButton clientId={client.id} />
        </div>
      </div>

      {/* Tabs */}
      <ClientTabs tabs={tabs}>
        {/* Tab 1: Info General */}
        <ClientForm client={clientForForm} users={users} />

        {/* Tab 2: Facturación */}
        <div className="bg-surface-container-low rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 mb-1">Tipo de facturación</p>
              <p className="text-sm font-bold text-white">{BILLING_TYPE_LABEL[client.billingType as BillingType] ?? client.billingType}</p>
            </div>
            {client.billingType === "MONTHLY" && (
              <>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 mb-1">Abono mensual</p>
                  <p className="text-sm font-bold text-white">USD {client.monthlyAmount.toLocaleString()}</p>
                </div>
                {client.metaBudget && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 mb-1">Presupuesto Meta Ads</p>
                    <p className="text-sm font-bold text-white">USD {client.metaBudget.toLocaleString()}</p>
                  </div>
                )}
                {client.googleBudget && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 mb-1">Presupuesto Google Ads</p>
                    <p className="text-sm font-bold text-white">USD {client.googleBudget.toLocaleString()}</p>
                  </div>
                )}
              </>
            )}
            {client.billingType === "COMMISSION" && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 mb-1">Comisión acordada</p>
                <p className="text-sm font-bold text-white">{client.commissionRate}%</p>
              </div>
            )}
            {client.contractStartDate && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 mb-1">Inicio de contrato</p>
                <p className="text-sm font-bold text-white">{new Date(client.contractStartDate).toLocaleDateString("es-AR")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tab 3: Pagos */}
        <PaymentsTab
          clientId={client.id}
          payments={client.payments.map(p => ({
            id: p.id,
            amountARS: p.amountARS,
            date: p.date,
            month: p.month,
            description: p.description,
          }))}
        />

        {/* Tab 4: Meetings */}
        <div>
          <div className="flex justify-end mb-6">
            <Link href={`/meetings/new?clientId=${client.id}`} className="cta-gradient text-white py-2.5 px-5 rounded-xl font-bold text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base">add</span>
              Nueva Reunión
            </Link>
          </div>
          <div className="space-y-4">
            {client.meetings.length === 0 && <p className="text-sm text-neutral-500">Sin reuniones registradas.</p>}
            {client.meetings.map((m) => (
              <div key={m.id} className="bg-surface-container-low rounded-xl p-5 flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">
                    {new Date(m.scheduledAt).toLocaleDateString("es-AR", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                  <h5 className="text-sm font-bold text-white">{m.title}</h5>
                  {m.notes && <p className="text-xs text-neutral-400 mt-1">{m.notes}</p>}
                </div>
                <MeetingStatusBadge status={m.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Tab 5: Notes */}
        <NotesForm clientId={client.id} initialNotes={client.notes ?? ""} />
      </ClientTabs>
    </div>
  )
}
