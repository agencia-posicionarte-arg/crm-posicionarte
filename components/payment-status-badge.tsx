function currentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

function previousMonth() {
  const now = new Date()
  const d = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

type Props = {
  billingType: string
  paymentTiming?: string
  status?: string
  payments: { month: string }[]
}

export default function PaymentStatusBadge({ billingType, paymentTiming, status, payments }: Props) {
  if (status === "PROSPECTO") return null
  if (billingType === "ONE_TIME") return null

  // Mes vencido: está al día si pagó el mes anterior
  // Adelantado: está al día si pagó el mes actual
  const targetMonth = paymentTiming === "ARREAR" ? previousMonth() : currentMonth()
  const paid = payments.some((p) => p.month === targetMonth)

  return paid ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider">
      <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
      Al día
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error/10 text-error text-[10px] font-bold uppercase tracking-wider">
      <span className="w-1.5 h-1.5 rounded-full bg-error inline-block" />
      Debe pagar
    </span>
  )
}
